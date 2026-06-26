import type { WordStats } from "./storage";

export type ComboTier = "none" | "warm" | "hot" | "fire" | "legendary";

export function getComboTier(streak: number): ComboTier {
  if (streak >= 8) return "legendary";
  if (streak >= 5) return "fire";
  if (streak >= 3) return "hot";
  if (streak >= 2) return "warm";
  return "none";
}

export const COMBO_CONFIG: Record<
  ComboTier,
  { label: string; emoji: string; color: string; glow: string; particleCount: number }
> = {
  none: { label: "", emoji: "", color: "#ffffff", glow: "", particleCount: 0 },
  warm: { label: "Nice!", emoji: "✨", color: "#F59E0B", glow: "0 0 20px #F59E0B44", particleCount: 6 },
  hot: { label: "On Fire!", emoji: "🔥", color: "#EF4444", glow: "0 0 30px #EF444444", particleCount: 10 },
  fire: { label: "UNSTOPPABLE!", emoji: "⚡", color: "#A855F7", glow: "0 0 40px #A855F744", particleCount: 16 },
  legendary: { label: "LEGENDARY!", emoji: "💎", color: "#06B6D4", glow: "0 0 50px #06B6D444", particleCount: 24 },
};

export function isVictoryPhrase(wordStats: WordStats): boolean {
  return wordStats.timesWrong > 0 && wordStats.streak === 1 && wordStats.timesCorrect >= 1;
}

export function calculateXpWithCombo(
  baseXp: number,
  sessionStreak: number,
  phraseStreak: number,
): { total: number; base: number; comboBonus: number; streakBonus: number } {
  const streakBonus = phraseStreak * 2;
  const comboMultiplier = sessionStreak >= 8 ? 3 : sessionStreak >= 5 ? 2.5 : sessionStreak >= 3 ? 2 : sessionStreak >= 2 ? 1.5 : 1;
  const comboBonus = Math.round(baseXp * (comboMultiplier - 1));

  return {
    total: baseXp + streakBonus + comboBonus,
    base: baseXp,
    comboBonus,
    streakBonus,
  };
}

export type DailyStreakMilestone = {
  days: number;
  label: string;
  emoji: string;
};

export function getDailyStreakMilestone(days: number): DailyStreakMilestone | null {
  const milestones: DailyStreakMilestone[] = [
    { days: 3, label: "3-Day Streak!", emoji: "🔥" },
    { days: 5, label: "5-Day Streak!", emoji: "⭐" },
    { days: 7, label: "One Week!", emoji: "🏆" },
    { days: 14, label: "Two Weeks!", emoji: "💪" },
    { days: 30, label: "One Month!", emoji: "👑" },
  ];

  return milestones.find((m) => m.days === days) ?? null;
}
