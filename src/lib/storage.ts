import { openDB, type IDBPDatabase } from "idb";

export interface WordStats {
  phraseId: string;
  timesSeen: number;
  timesCorrect: number;
  timesWrong: number;
  streak: number;
  lastSeen: number;
  averageResponseMs: number;
}

export interface SessionStats {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string;
  sessionsCompleted: number;
  totalCorrect: number;
  totalWrong: number;
}

const DB_NAME = "nursolingo";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("wordStats")) {
          db.createObjectStore("wordStats", { keyPath: "phraseId" });
        }
        if (!db.objectStoreNames.contains("sessionStats")) {
          db.createObjectStore("sessionStats");
        }
      },
    });
  }
  return dbPromise;
}

const DEFAULT_SESSION_STATS: SessionStats = {
  totalXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: "",
  sessionsCompleted: 0,
  totalCorrect: 0,
  totalWrong: 0,
};

export async function getWordStats(phraseId: string): Promise<WordStats> {
  const db = await getDb();
  const stats = await db.get("wordStats", phraseId);
  return (
    stats ?? {
      phraseId,
      timesSeen: 0,
      timesCorrect: 0,
      timesWrong: 0,
      streak: 0,
      lastSeen: 0,
      averageResponseMs: 0,
    }
  );
}

export async function updateWordStats(
  phraseId: string,
  isCorrect: boolean,
  responseMs: number,
): Promise<WordStats> {
  const db = await getDb();
  const current = await getWordStats(phraseId);

  const updated: WordStats = {
    ...current,
    timesSeen: current.timesSeen + 1,
    timesCorrect: current.timesCorrect + (isCorrect ? 1 : 0),
    timesWrong: current.timesWrong + (isCorrect ? 0 : 1),
    streak: isCorrect ? current.streak + 1 : 0,
    lastSeen: Date.now(),
    averageResponseMs:
      current.timesSeen === 0
        ? responseMs
        : (current.averageResponseMs * current.timesSeen + responseMs) /
          (current.timesSeen + 1),
  };

  await db.put("wordStats", updated);
  return updated;
}

export async function getSessionStats(): Promise<SessionStats> {
  const db = await getDb();
  const stats = await db.get("sessionStats", "current");
  return stats ?? { ...DEFAULT_SESSION_STATS };
}

export async function updateSessionStats(
  patch: Partial<SessionStats>,
): Promise<SessionStats> {
  const db = await getDb();
  const current = await getSessionStats();
  const updated = { ...current, ...patch };
  await db.put("sessionStats", updated, "current");
  return updated;
}

export async function recordAnswer(
  phraseId: string,
  isCorrect: boolean,
  responseMs: number,
): Promise<{ wordStats: WordStats; sessionStats: SessionStats }> {
  const wordStats = await updateWordStats(phraseId, isCorrect, responseMs);

  const session = await getSessionStats();
  const today = new Date().toISOString().slice(0, 10);
  const isNewDay = session.lastSessionDate !== today;

  const xpGain = isCorrect ? 10 + wordStats.streak * 2 : 0;
  const newStreak = isNewDay
    ? isStreakAlive(session.lastSessionDate)
      ? session.currentStreak + 1
      : 1
    : session.currentStreak;

  const sessionStats = await updateSessionStats({
    totalXp: session.totalXp + xpGain,
    currentStreak: newStreak,
    longestStreak: Math.max(session.longestStreak, newStreak),
    lastSessionDate: today,
    totalCorrect: session.totalCorrect + (isCorrect ? 1 : 0),
    totalWrong: session.totalWrong + (isCorrect ? 0 : 1),
  });

  return { wordStats, sessionStats };
}

function isStreakAlive(lastDate: string): boolean {
  if (!lastDate) return false;
  const last = new Date(lastDate);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 1.5;
}

export async function getAllWordStats(): Promise<WordStats[]> {
  const db = await getDb();
  return db.getAll("wordStats");
}
