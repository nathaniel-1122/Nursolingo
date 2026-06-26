import type { SoundCategory } from "./sounds";

export type SoundSettings = {
  masterEnabled: boolean;
  categories: Record<SoundCategory, boolean>;
};

const STORAGE_KEY = "nursolingo-sound-settings";

const DEFAULT_SETTINGS: SoundSettings = {
  masterEnabled: true,
  categories: {
    answers: true,
    combos: true,
    celebrations: true,
    ui: true,
  },
};

export function loadSoundSettings(): SoundSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(stored) as Partial<SoundSettings>;
    return {
      masterEnabled: parsed.masterEnabled ?? DEFAULT_SETTINGS.masterEnabled,
      categories: { ...DEFAULT_SETTINGS.categories, ...parsed.categories },
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSoundSettings(settings: SoundSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
