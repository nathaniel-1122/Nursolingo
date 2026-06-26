import type { Phrase, PhraseCategory } from "./phrases";
import { PHRASES, getPhrasesByCategory } from "./phrases";
import { getAllWordStats, getPhraseOverrides, type WordStats } from "./storage";
import { buildReviewQueue } from "./srs";

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

const SESSION_SIZE = 8;

export async function createDrillSession(
  category: PhraseCategory | "all" | "weak",
  count: number = SESSION_SIZE,
): Promise<DrillSession> {
  const allStats = await getAllWordStats();
  const statsMap = new Map<string, WordStats>();
  for (const s of allStats) {
    statsMap.set(s.phraseId, s);
  }

  const candidatePool =
    category === "all" || category === "weak"
      ? PHRASES
      : getPhrasesByCategory(category);

  const queue = buildReviewQueue(candidatePool, statsMap);
  const selected = queue.slice(0, count).map((s) => s.phrase);

  const overrides = await getPhraseOverrides();
  const withOverrides = selected.map((p) =>
    overrides[p.id] ? { ...p, spanish: overrides[p.id] } : p,
  );

  return {
    phrases: withOverrides,
    currentIndex: 0,
    results: [],
    startedAt: Date.now(),
  };
}

export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[¿¡.,!?;:]/g, "")
    .replace(/\s+/g, " ");
}

export function stripAccents(input: string): string {
  return input.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function isCloseMatch(userAnswer: string, correctAnswer: string): boolean {
  const normalized = normalizeAnswer(userAnswer);
  const correct = normalizeAnswer(correctAnswer);

  if (normalized === correct) return true;
  if (stripAccents(normalized) === stripAccents(correct)) return true;

  if (correct.length > 20 && levenshteinDistance(normalized, correct) <= 3) {
    return true;
  }
  if (correct.length > 10 && levenshteinDistance(normalized, correct) <= 2) {
    return true;
  }
  if (correct.length <= 10 && levenshteinDistance(normalized, correct) <= 1) {
    return true;
  }

  return false;
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
