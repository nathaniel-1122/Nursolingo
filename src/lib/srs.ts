import type { WordStats } from "./storage";
import type { Phrase } from "./phrases";

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

export interface SrsSchedule {
  interval: number;
  easeFactor: number;
  dueAt: number;
}

function qualityFromAnswer(isCorrect: boolean, responseMs: number): number {
  if (!isCorrect) return 1;
  if (responseMs < 5000) return 5;
  if (responseMs < 15000) return 4;
  return 3;
}

export function calculateNextReview(
  stats: WordStats,
  isCorrect: boolean,
  responseMs: number,
): SrsSchedule {
  const quality = qualityFromAnswer(isCorrect, responseMs);
  const prevInterval = stats.srsInterval;
  const prevEase = stats.srsEaseFactor || DEFAULT_EASE_FACTOR;
  const now = Date.now();

  if (quality < 3) {
    // Failed — reset interval, reduce ease
    const newEase = Math.max(MIN_EASE_FACTOR, prevEase - 0.2);
    return { interval: 0, easeFactor: newEase, dueAt: now };
  }

  // Successful recall
  let newInterval: number;
  const correctStreak = stats.streak + 1;

  if (correctStreak === 1) {
    newInterval = 1;
  } else if (correctStreak === 2) {
    newInterval = 3;
  } else {
    newInterval = Math.round(prevInterval * prevEase * 10) / 10;
  }

  // SM-2 ease factor adjustment: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
  const newEase = Math.max(
    MIN_EASE_FACTOR,
    prevEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  const dueAt = now + newInterval * 24 * 60 * 60 * 1000;

  return { interval: newInterval, easeFactor: newEase, dueAt };
}

export interface ScoredPhrase {
  phrase: Phrase;
  priority: number;
  status: "overdue" | "new" | "upcoming";
}

export function buildReviewQueue(
  phrases: readonly Phrase[],
  statsMap: Map<string, WordStats>,
): ScoredPhrase[] {
  const now = Date.now();

  const scored: ScoredPhrase[] = phrases.map((phrase) => {
    const stats = statsMap.get(phrase.id);

    if (!stats || stats.timesSeen === 0) {
      return { phrase, priority: 1, status: "new" as const };
    }

    const dueAt = stats.srsDueAt || stats.lastSeen;

    if (dueAt <= now) {
      // Overdue — higher priority the more overdue
      const overdueDays = (now - dueAt) / (24 * 60 * 60 * 1000);
      return { phrase, priority: 2 + overdueDays, status: "overdue" as const };
    }

    // Upcoming — lower priority the further out
    const daysUntilDue = (dueAt - now) / (24 * 60 * 60 * 1000);
    return {
      phrase,
      priority: Math.max(0, 1 - daysUntilDue / 30),
      status: "upcoming" as const,
    };
  });

  scored.sort((a, b) => b.priority - a.priority);
  return scored;
}

export function getDueCount(
  phrases: readonly Phrase[],
  statsMap: Map<string, WordStats>,
): number {
  const now = Date.now();
  let count = 0;
  for (const phrase of phrases) {
    const stats = statsMap.get(phrase.id);
    if (!stats || stats.timesSeen === 0) {
      count++;
    } else {
      const dueAt = stats.srsDueAt || stats.lastSeen;
      if (dueAt <= now) count++;
    }
  }
  return count;
}
