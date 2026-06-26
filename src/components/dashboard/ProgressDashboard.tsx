"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getAllWordStats,
  getSessionStats,
  type WordStats,
  type SessionStats,
} from "@/lib/storage";
import {
  PHRASES,
  CATEGORY_META,
  type PhraseCategory,
  getCategories,
  getPhrasesByCategory,
} from "@/lib/phrases";

type DashboardProps = {
  onBack: () => void;
};

type MasteryLevel = "new" | "learning" | "reviewing" | "mastered";

const MASTERY_CONFIG: Record<
  MasteryLevel,
  { label: string; color: string; emoji: string; glow: string }
> = {
  new: {
    label: "New",
    color: "#64748B",
    emoji: "🌑",
    glow: "rgba(100, 116, 139, 0.3)",
  },
  learning: {
    label: "Learning",
    color: "#F59E0B",
    emoji: "🌱",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  reviewing: {
    label: "Reviewing",
    color: "#7C3AED",
    emoji: "🔄",
    glow: "rgba(124, 58, 237, 0.4)",
  },
  mastered: {
    label: "Mastered",
    color: "#059669",
    emoji: "⭐",
    glow: "rgba(5, 150, 105, 0.5)",
  },
};

function getMasteryLevel(stats: WordStats | undefined): MasteryLevel {
  if (!stats || stats.timesSeen === 0) return "new";
  const accuracy =
    stats.timesCorrect / (stats.timesCorrect + stats.timesWrong);
  if (accuracy >= 0.85 && stats.streak >= 3 && stats.srsInterval >= 7)
    return "mastered";
  if (accuracy >= 0.6 && stats.timesSeen >= 3) return "reviewing";
  return "learning";
}

type CategoryStats = {
  category: PhraseCategory;
  total: number;
  practiced: number;
  correct: number;
  wrong: number;
  mastered: number;
  avgResponseMs: number;
};

function computeCategoryStats(
  statsMap: Map<string, WordStats>,
): CategoryStats[] {
  return getCategories().map((cat) => {
    const phrases = getPhrasesByCategory(cat);
    let practiced = 0;
    let correct = 0;
    let wrong = 0;
    let mastered = 0;
    let totalResponseMs = 0;
    let responseCount = 0;

    for (const p of phrases) {
      const ws = statsMap.get(p.id);
      if (ws && ws.timesSeen > 0) {
        practiced++;
        correct += ws.timesCorrect;
        wrong += ws.timesWrong;
        if (getMasteryLevel(ws) === "mastered") mastered++;
        if (ws.averageResponseMs > 0) {
          totalResponseMs += ws.averageResponseMs;
          responseCount++;
        }
      }
    }

    return {
      category: cat,
      total: phrases.length,
      practiced,
      correct,
      wrong,
      mastered,
      avgResponseMs: responseCount > 0 ? totalResponseMs / responseCount : 0,
    };
  });
}

export function ProgressDashboard({ onBack }: DashboardProps) {
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [wordStatsMap, setWordStatsMap] = useState<Map<string, WordStats>>(
    new Map(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSessionStats(), getAllWordStats()]).then(
      ([session, allWords]) => {
        setSessionStats(session);
        setWordStatsMap(new Map(allWords.map((w) => [w.phraseId, w])));
        setIsLoading(false);
      },
    );
  }, []);

  if (isLoading || !sessionStats) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-4xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  const masteryDistribution = { new: 0, learning: 0, reviewing: 0, mastered: 0 };
  for (const p of PHRASES) {
    const level = getMasteryLevel(wordStatsMap.get(p.id));
    masteryDistribution[level]++;
  }

  const categoryStats = computeCategoryStats(wordStatsMap);
  const totalAccuracy =
    sessionStats.totalCorrect + sessionStats.totalWrong > 0
      ? Math.round(
          (sessionStats.totalCorrect /
            (sessionStats.totalCorrect + sessionStats.totalWrong)) *
            100,
        )
      : 0;

  return (
    <div className="flex flex-col min-h-dvh px-4 py-6 max-w-lg mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
            Progress
          </h1>
          <p className="text-xs text-white/40">Your learning journey</p>
        </div>
      </motion.div>

      {/* Hero Stats */}
      <HeroStats sessionStats={sessionStats} totalAccuracy={totalAccuracy} />

      {/* SRS Pipeline */}
      <SrsPipeline distribution={masteryDistribution} />

      {/* Mastery Grid */}
      <MasteryGrid wordStatsMap={wordStatsMap} />

      {/* Category Breakdown */}
      <CategoryBreakdown stats={categoryStats} />

      <div className="h-8" />
    </div>
  );
}

function HeroStats({
  sessionStats,
  totalAccuracy,
}: {
  sessionStats: SessionStats;
  totalAccuracy: number;
}) {
  const heroItems = [
    {
      label: "Total XP",
      value: sessionStats.totalXp.toLocaleString(),
      emoji: "⚡",
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B33, #EA580C22)",
    },
    {
      label: "Day Streak",
      value: `${sessionStats.currentStreak}`,
      emoji: "🔥",
      color: "#E8356D",
      gradient: "linear-gradient(135deg, #E8356D33, #DC262622)",
    },
    {
      label: "Accuracy",
      value: totalAccuracy > 0 ? `${totalAccuracy}%` : "—",
      emoji: "🎯",
      color: "#059669",
      gradient: "linear-gradient(135deg, #05966933, #0891B222)",
    },
    {
      label: "Sessions",
      value: `${sessionStats.sessionsCompleted}`,
      emoji: "📖",
      color: "#7C3AED",
      gradient: "linear-gradient(135deg, #7C3AED33, #9333EA22)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {heroItems.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 200 }}
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background: item.gradient,
            border: `1px solid ${item.color}33`,
          }}
        >
          <div
            className="absolute -top-3 -right-3 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xl block mb-1">{item.emoji}</span>
          <p
            className="text-2xl font-black"
            style={{ color: item.color }}
          >
            {item.value}
          </p>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function SrsPipeline({
  distribution,
}: {
  distribution: Record<MasteryLevel, number>;
}) {
  const stages: MasteryLevel[] = ["new", "learning", "reviewing", "mastered"];
  const total = PHRASES.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6"
    >
      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
        Learning Pipeline
      </h2>
      <div className="bg-white/5 rounded-2xl p-4">
        {/* Funnel bars */}
        <div className="space-y-3">
          {stages.map((stage, i) => {
            const count = distribution[stage];
            const pct = total > 0 ? (count / total) * 100 : 0;
            const config = MASTERY_CONFIG[stage];

            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{config.emoji}</span>
                    <span className="text-xs font-semibold text-white/70">
                      {config.label}
                    </span>
                  </div>
                  <span
                    className="text-sm font-black"
                    style={{ color: config.color }}
                  >
                    {count}
                  </span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%` }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${config.color}, ${config.color}aa)`,
                      boxShadow: `0 0 12px ${config.glow}`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary line */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-white/30">
            {distribution.mastered + distribution.reviewing} of {total} phrases
            progressing
          </span>
          <span className="text-xs font-bold" style={{ color: "#059669" }}>
            {Math.round(((distribution.mastered) / total) * 100)}% mastered
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function MasteryGrid({
  wordStatsMap,
}: {
  wordStatsMap: Map<string, WordStats>;
}) {
  const [expandedCategory, setExpandedCategory] = useState<PhraseCategory | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-6"
    >
      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
        Mastery Map
      </h2>
      <div className="space-y-3">
        {getCategories().map((cat, catIdx) => {
          const meta = CATEGORY_META[cat];
          const phrases = getPhrasesByCategory(cat);
          const isExpanded = expandedCategory === cat;

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + catIdx * 0.04 }}
            >
              <button
                onClick={() =>
                  setExpandedCategory(isExpanded ? null : cat)
                }
                className="w-full bg-white/5 hover:bg-white/8 rounded-2xl p-3 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{meta.emoji}</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: meta.color }}
                  >
                    {meta.label}
                  </span>
                  <span className="text-[10px] text-white/30 ml-auto">
                    {phrases.filter(
                      (p) => getMasteryLevel(wordStatsMap.get(p.id)) === "mastered",
                    ).length}
                    /{phrases.length}
                  </span>
                </div>
                {/* Dot grid */}
                <div className="flex flex-wrap gap-1.5">
                  {phrases.map((phrase) => {
                    const level = getMasteryLevel(wordStatsMap.get(phrase.id));
                    const config = MASTERY_CONFIG[level];
                    return (
                      <motion.div
                        key={phrase.id}
                        whileHover={{ scale: 1.5 }}
                        className="w-4 h-4 rounded-md"
                        style={{
                          backgroundColor: config.color,
                          boxShadow:
                            level !== "new"
                              ? `0 0 6px ${config.glow}`
                              : "none",
                          opacity: level === "new" ? 0.3 : 1,
                        }}
                        title={phrase.english}
                      />
                    );
                  })}
                </div>
              </button>

              {/* Expanded phrase list */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 pt-2 px-1">
                    {phrases.map((phrase) => {
                      const ws = wordStatsMap.get(phrase.id);
                      const level = getMasteryLevel(ws);
                      const config = MASTERY_CONFIG[level];
                      const accuracy =
                        ws && ws.timesCorrect + ws.timesWrong > 0
                          ? Math.round(
                              (ws.timesCorrect /
                                (ws.timesCorrect + ws.timesWrong)) *
                                100,
                            )
                          : null;

                      return (
                        <div
                          key={phrase.id}
                          className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/3"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: config.color }}
                          />
                          <p className="text-xs text-white/70 flex-1 truncate">
                            {phrase.english}
                          </p>
                          {accuracy !== null ? (
                            <span
                              className="text-xs font-bold shrink-0"
                              style={{ color: config.color }}
                            >
                              {accuracy}%
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/20 shrink-0">
                              new
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3">
        {(["new", "learning", "reviewing", "mastered"] as MasteryLevel[]).map(
          (level) => (
            <div key={level} className="flex items-center gap-1">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{
                  backgroundColor: MASTERY_CONFIG[level].color,
                  opacity: level === "new" ? 0.3 : 1,
                }}
              />
              <span className="text-[9px] text-white/30">
                {MASTERY_CONFIG[level].label}
              </span>
            </div>
          ),
        )}
      </div>
    </motion.div>
  );
}

function CategoryBreakdown({ stats }: { stats: CategoryStats[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
        Category Breakdown
      </h2>
      <div className="space-y-2">
        {stats.map((cat, i) => {
          const meta = CATEGORY_META[cat.category];
          const accuracy =
            cat.correct + cat.wrong > 0
              ? Math.round((cat.correct / (cat.correct + cat.wrong)) * 100)
              : 0;
          const completionPct =
            cat.total > 0
              ? Math.round((cat.practiced / cat.total) * 100)
              : 0;

          return (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 + i * 0.04 }}
              className="bg-white/5 rounded-xl p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{meta.emoji}</span>
                <span
                  className="text-xs font-bold flex-1"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </span>
                <div className="flex items-center gap-3">
                  {cat.practiced > 0 && (
                    <span className="text-xs text-white/40">
                      {accuracy}% acc
                    </span>
                  )}
                  <span
                    className="text-xs font-bold"
                    style={{ color: meta.color }}
                  >
                    {completionPct}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{
                    delay: 0.8 + i * 0.04,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${meta.color}, ${meta.color}88)`,
                    boxShadow: `0 0 8px ${meta.color}44`,
                  }}
                />
              </div>

              {/* Details row */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-white/25">
                  {cat.practiced}/{cat.total} practiced
                </span>
                <span className="text-[10px] text-white/25">
                  {cat.mastered} mastered
                </span>
                {cat.avgResponseMs > 0 && (
                  <span className="text-[10px] text-white/25 ml-auto">
                    ~{(cat.avgResponseMs / 1000).toFixed(1)}s avg
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
