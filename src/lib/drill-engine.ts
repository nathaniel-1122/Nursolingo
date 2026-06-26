import type { Phrase, PhraseCategory } from "./phrases";
import { PHRASES, getPhrasesByCategory } from "./phrases";
import { getAllWordStats, getPhraseOverrides, type WordStats } from "./storage";

export interface DrillSession {
  phrases: Phrase[];
  currentIndex: number;
  results: DrillResult[];
  startedAt: number;
}

export interface DrillResult {
  phraseId: string;
  isCorrect: boolean;
  userAnswer: string;
  responseMs: number;
}

export async function createDrillSession(
  category: PhraseCategory | "all" | "weak",
  count: number = 10,
): Promise<DrillSession> {
  let pool: Phrase[];

  if (category === "all") {
    pool = [...PHRASES];
  } else if (category === "weak") {
    pool = await getWeakPhrases(count);
  } else {
    pool = getPhrasesByCategory(category);
  }

  const overrides = await getPhraseOverrides();
  const withOverrides = pool.map((p) =>
    overrides[p.id] ? { ...p, spanish: overrides[p.id] } : p,
  );

  const shuffled = shuffleArray(withOverrides).slice(0, count);

  return {
    phrases: shuffled,
    currentIndex: 0,
    results: [],
    startedAt: Date.now(),
  };
}

async function getWeakPhrases(count: number): Promise<Phrase[]> {
  const allStats = await getAllWordStats();
  const statsMap = new Map<string, WordStats>();
  for (const s of allStats) {
    statsMap.set(s.phraseId, s);
  }

  const scored = PHRASES.map((phrase) => {
    const stats = statsMap.get(phrase.id);
    if (!stats || stats.timesSeen === 0) return { phrase, score: 0.5 };

    const accuracy = stats.timesCorrect / stats.timesSeen;
    const recency = (Date.now() - stats.lastSeen) / (1000 * 60 * 60 * 24);
    // Lower accuracy + longer since seen = higher priority
    const score = (1 - accuracy) * 0.6 + Math.min(recency / 7, 1) * 0.4;
    return { phrase, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.phrase);
}

function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[¿¡.,!?;:]/g, "")
    .replace(/\s+/g, " ");
}

export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalized = normalizeAnswer(userAnswer);
  const correct = normalizeAnswer(correctAnswer);

  if (normalized === correct) return true;

  // Allow minor typos: Levenshtein distance <= 2 for long phrases
  if (correct.length > 20 && levenshteinDistance(normalized, correct) <= 3) {
    return true;
  }
  if (correct.length > 10 && levenshteinDistance(normalized, correct) <= 2) {
    return true;
  }

  return false;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[b.length][a.length];
}
