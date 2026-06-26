"use client";

import { motion } from "framer-motion";
import type { DrillResult } from "@/lib/drill-engine";
import type { Phrase } from "@/lib/phrases";
import type { SessionStats } from "@/lib/storage";

type SessionSummaryProps = {
  results: DrillResult[];
  phrases: Phrase[];
  sessionStats: SessionStats;
  onExit: () => void;
  onRetry: () => void;
};

export function SessionSummary({
  results,
  phrases,
  sessionStats,
  onExit,
  onRetry,
}: SessionSummaryProps) {
  const correct = results.filter((r) => r.isCorrect).length;
  const total = results.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const xpEarned = correct * 10;

  const grade =
    pct >= 90
      ? { label: "Amazing!", emoji: "🌟", color: "#F59E0B" }
      : pct >= 70
        ? { label: "Great job!", emoji: "🔥", color: "#E8356D" }
        : pct >= 50
          ? { label: "Good effort!", emoji: "💪", color: "#7C3AED" }
          : { label: "Keep practicing!", emoji: "📚", color: "#0891B2" };

  const phraseMap = new Map(phrases.map((p) => [p.id, p]));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center min-h-[100dvh] px-4 py-8"
    >
      {/* Grade */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-center mb-8"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="text-6xl block mb-3"
        >
          {grade.emoji}
        </motion.span>
        <h2
          className="text-3xl font-black mb-1"
          style={{ color: grade.color }}
        >
          {grade.label}
        </h2>
        <p className="text-white/50">
          {correct} out of {total} correct
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm mb-8">
        {[
          { label: "Score", value: `${pct}%`, color: grade.color },
          { label: "XP Earned", value: `+${xpEarned}`, color: "#F59E0B" },
          {
            label: "Streak",
            value: `${sessionStats.currentStreak}🔥`,
            color: "#E8356D",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 rounded-2xl p-4 text-center"
          >
            <p className="text-2xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs text-white/40 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Results breakdown */}
      <div className="w-full max-w-sm space-y-2 mb-8">
        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">
          Results
        </h3>
        {results.map((result, i) => {
          const phrase = phraseMap.get(result.phraseId);
          if (!phrase) return null;
          return (
            <motion.div
              key={result.phraseId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-xl ${
                result.isCorrect ? "bg-emerald-500/10" : "bg-red-500/10"
              }`}
            >
              <span
                className={`text-sm mt-0.5 ${result.isCorrect ? "text-emerald-400" : "text-red-400"}`}
              >
                {result.isCorrect ? "✓" : "✗"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 truncate">
                  {phrase.english}
                </p>
                {!result.isCorrect && (
                  <p className="text-xs text-amber-300/60 mt-1 truncate">
                    → {phrase.spanish}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={onRetry}
          className="flex-1 py-4 rounded-2xl font-bold text-white text-base"
          style={{ backgroundColor: grade.color }}
        >
          Practice Again
        </button>
        <button
          onClick={onExit}
          className="px-6 py-4 rounded-2xl font-semibold text-white/60 bg-white/10 hover:bg-white/20 transition-all"
        >
          Home
        </button>
      </div>

      {/* Lifetime stats */}
      <div className="mt-6 text-center text-xs text-white/30">
        <p>
          Total XP: {sessionStats.totalXp} | Sessions:{" "}
          {sessionStats.sessionsCompleted + 1} | Lifetime:{" "}
          {sessionStats.totalCorrect}/{sessionStats.totalCorrect + sessionStats.totalWrong} correct
        </p>
      </div>
    </motion.div>
  );
}
