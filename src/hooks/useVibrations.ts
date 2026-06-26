"use client";

import { useCallback, useRef } from "react";

type VibrationPattern = "correct" | "wrong" | "comboWarm" | "comboHot" | "comboFire" | "comboLegendary" | "victory" | "sessionComplete";

function vibrateDevice(pattern: number[]): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

const PATTERNS: Record<VibrationPattern, number[]> = {
  correct: [30],
  wrong: [15, 30, 15],
  comboWarm: [20, 10, 30],
  comboHot: [20, 10, 30, 10, 40],
  comboFire: [20, 10, 30, 10, 40, 10, 50],
  comboLegendary: [30, 10, 40, 10, 50, 10, 60, 10, 80],
  victory: [50, 20, 50, 20, 100],
  sessionComplete: [40, 20, 40, 20, 40, 20, 120],
};

export function useVibrations() {
  const lastComboRef = useRef<number>(0);

  const vibrate = useCallback((pattern: VibrationPattern) => {
    vibrateDevice(PATTERNS[pattern] ?? [30]);
  }, []);

  const vibrateCombo = useCallback((streak: number) => {
    if (streak >= 8 && lastComboRef.current < 8) {
      vibrateDevice(PATTERNS.comboLegendary);
      lastComboRef.current = streak;
    } else if (streak >= 5 && lastComboRef.current < 5) {
      vibrateDevice(PATTERNS.comboFire);
      lastComboRef.current = streak;
    } else if (streak >= 3 && lastComboRef.current < 3) {
      vibrateDevice(PATTERNS.comboHot);
      lastComboRef.current = streak;
    } else if (streak >= 2 && lastComboRef.current < 2) {
      vibrateDevice(PATTERNS.comboWarm);
      lastComboRef.current = streak;
    }
  }, []);

  const resetVibrateTracking = useCallback(() => {
    lastComboRef.current = 0;
  }, []);

  return { vibrate, vibrateCombo, resetVibrateTracking };
}
