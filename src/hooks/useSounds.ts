"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import {
  SoundEffects,
  SOUND_CATEGORIES,
  type SoundName,
  type SoundCategory,
} from "@/lib/sounds";
import {
  loadSoundSettings,
  saveSoundSettings,
  type SoundSettings,
} from "@/lib/sound-settings";

type Listener = () => void;

const listeners = new Set<Listener>();
let currentSettings: SoundSettings | null = null;

function getSettings(): SoundSettings {
  if (!currentSettings) {
    currentSettings = loadSoundSettings();
  }
  return currentSettings;
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): SoundSettings {
  return getSettings();
}

function getServerSnapshot(): SoundSettings {
  return {
    masterEnabled: true,
    categories: { answers: true, combos: true, celebrations: true, ui: true },
  };
}

function findCategory(sound: SoundName): SoundCategory | null {
  for (const [cat, config] of Object.entries(SOUND_CATEGORIES)) {
    if ((config.sounds as readonly string[]).includes(sound)) {
      return cat as SoundCategory;
    }
  }
  return null;
}

export function useSounds() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const lastComboSoundRef = useRef<number>(0);

  const play = useCallback(
    (sound: SoundName) => {
      const s = getSettings();
      if (!s.masterEnabled) return;

      const category = findCategory(sound);
      if (category && !s.categories[category]) return;

      SoundEffects[sound]();
    },
    [],
  );

  const playComboSound = useCallback(
    (streak: number) => {
      const s = getSettings();
      if (!s.masterEnabled || !s.categories.combos) return;

      if (streak >= 8 && lastComboSoundRef.current < 8) {
        SoundEffects.comboLegendary();
        lastComboSoundRef.current = streak;
      } else if (streak >= 5 && lastComboSoundRef.current < 5) {
        SoundEffects.comboFire();
        lastComboSoundRef.current = streak;
      } else if (streak >= 3 && lastComboSoundRef.current < 3) {
        SoundEffects.comboHot();
        lastComboSoundRef.current = streak;
      } else if (streak >= 2 && lastComboSoundRef.current < 2) {
        SoundEffects.comboWarm();
        lastComboSoundRef.current = streak;
      }
    },
    [],
  );

  const resetComboTracking = useCallback(() => {
    lastComboSoundRef.current = 0;
  }, []);

  const updateSettings = useCallback((patch: Partial<SoundSettings>) => {
    const current = getSettings();
    const updated: SoundSettings = {
      ...current,
      ...patch,
      categories: {
        ...current.categories,
        ...(patch.categories ?? {}),
      },
    };
    currentSettings = updated;
    saveSoundSettings(updated);
    notifyListeners();
  }, []);

  const toggleCategory = useCallback((category: SoundCategory) => {
    const current = getSettings();
    const updated: SoundSettings = {
      ...current,
      categories: {
        ...current.categories,
        [category]: !current.categories[category],
      },
    };
    currentSettings = updated;
    saveSoundSettings(updated);
    notifyListeners();
  }, []);

  const toggleMaster = useCallback(() => {
    const current = getSettings();
    const updated: SoundSettings = {
      ...current,
      masterEnabled: !current.masterEnabled,
    };
    currentSettings = updated;
    saveSoundSettings(updated);
    notifyListeners();
  }, []);

  return {
    settings,
    play,
    playComboSound,
    resetComboTracking,
    updateSettings,
    toggleCategory,
    toggleMaster,
  };
}
