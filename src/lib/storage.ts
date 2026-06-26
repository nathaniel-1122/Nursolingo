import { supabase } from "./supabase";
import { calculateNextReview } from "./srs";

export interface WordStats {
  phraseId: string;
  timesSeen: number;
  timesCorrect: number;
  timesWrong: number;
  streak: number;
  lastSeen: number;
  averageResponseMs: number;
  srsInterval: number;
  srsEaseFactor: number;
  srsDueAt: number;
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

interface WordStatsRow {
  phrase_id: string;
  times_seen: number;
  times_correct: number;
  times_wrong: number;
  streak: number;
  last_seen: number;
  average_response_ms: number;
  srs_interval: number;
  srs_ease_factor: number;
  srs_due_at: number;
}

interface SessionStatsRow {
  id: string;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_session_date: string;
  sessions_completed: number;
  total_correct: number;
  total_wrong: number;
}

function rowToWordStats(row: WordStatsRow): WordStats {
  return {
    phraseId: row.phrase_id,
    timesSeen: row.times_seen,
    timesCorrect: row.times_correct,
    timesWrong: row.times_wrong,
    streak: row.streak,
    lastSeen: row.last_seen,
    averageResponseMs: row.average_response_ms,
    srsInterval: row.srs_interval ?? 0,
    srsEaseFactor: row.srs_ease_factor ?? 2.5,
    srsDueAt: row.srs_due_at ?? 0,
  };
}

function rowToSessionStats(row: SessionStatsRow): SessionStats {
  return {
    totalXp: row.total_xp,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    lastSessionDate: row.last_session_date,
    sessionsCompleted: row.sessions_completed,
    totalCorrect: row.total_correct,
    totalWrong: row.total_wrong,
  };
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
  const { data } = await supabase
    .from("word_stats")
    .select()
    .eq("phrase_id", phraseId)
    .single();

  if (!data) {
    return {
      phraseId,
      timesSeen: 0,
      timesCorrect: 0,
      timesWrong: 0,
      streak: 0,
      lastSeen: 0,
      averageResponseMs: 0,
      srsInterval: 0,
      srsEaseFactor: 2.5,
      srsDueAt: 0,
    };
  }

  return rowToWordStats(data as WordStatsRow);
}

export async function updateWordStats(
  phraseId: string,
  isCorrect: boolean,
  responseMs: number,
): Promise<WordStats> {
  const current = await getWordStats(phraseId);

  const newStreak = isCorrect ? current.streak + 1 : 0;
  const srs = calculateNextReview(current, isCorrect, responseMs);

  const updated: WordStats = {
    ...current,
    timesSeen: current.timesSeen + 1,
    timesCorrect: current.timesCorrect + (isCorrect ? 1 : 0),
    timesWrong: current.timesWrong + (isCorrect ? 0 : 1),
    streak: newStreak,
    lastSeen: Date.now(),
    averageResponseMs:
      current.timesSeen === 0
        ? responseMs
        : (current.averageResponseMs * current.timesSeen + responseMs) /
          (current.timesSeen + 1),
    srsInterval: srs.interval,
    srsEaseFactor: srs.easeFactor,
    srsDueAt: srs.dueAt,
  };

  await supabase.from("word_stats").upsert({
    phrase_id: updated.phraseId,
    times_seen: updated.timesSeen,
    times_correct: updated.timesCorrect,
    times_wrong: updated.timesWrong,
    streak: updated.streak,
    last_seen: updated.lastSeen,
    average_response_ms: updated.averageResponseMs,
    srs_interval: updated.srsInterval,
    srs_ease_factor: updated.srsEaseFactor,
    srs_due_at: updated.srsDueAt,
  });

  return updated;
}

export async function getSessionStats(): Promise<SessionStats> {
  const { data } = await supabase
    .from("session_stats")
    .select()
    .eq("id", "current")
    .single();

  if (!data) return { ...DEFAULT_SESSION_STATS };

  return rowToSessionStats(data as SessionStatsRow);
}

export async function updateSessionStats(
  patch: Partial<SessionStats>,
): Promise<SessionStats> {
  const current = await getSessionStats();
  const updated = { ...current, ...patch };

  await supabase.from("session_stats").upsert({
    id: "current",
    total_xp: updated.totalXp,
    current_streak: updated.currentStreak,
    longest_streak: updated.longestStreak,
    last_session_date: updated.lastSessionDate,
    sessions_completed: updated.sessionsCompleted,
    total_correct: updated.totalCorrect,
    total_wrong: updated.totalWrong,
  });

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
  const { data } = await supabase.from("word_stats").select();
  if (!data) return [];
  return (data as WordStatsRow[]).map(rowToWordStats);
}

export async function savePhraseOverride(
  phraseId: string,
  correctedSpanish: string,
): Promise<void> {
  await supabase.from("phrase_overrides").upsert({
    phrase_id: phraseId,
    corrected_spanish: correctedSpanish,
  });
}

export async function getPhraseOverrides(): Promise<
  Record<string, string>
> {
  const { data } = await supabase.from("phrase_overrides").select();
  if (!data) return {};
  const overrides: Record<string, string> = {};
  for (const row of data as { phrase_id: string; corrected_spanish: string }[]) {
    overrides[row.phrase_id] = row.corrected_spanish;
  }
  return overrides;
}
