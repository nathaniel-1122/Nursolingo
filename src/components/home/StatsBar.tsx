"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSessionStats, type SessionStats } from "@/lib/storage";

export function StatsBar() {
  const [stats, setStats] = useState<SessionStats | null>(null);

  useEffect(() => {
    getSessionStats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-white/5 rounded-2xl px-5 py-3"
    >
      <StatItem
        label="XP"
        value={stats.totalXp.toLocaleString()}
        color="#F59E0B"
      />
      <div className="w-px h-8 bg-white/10" />
      <StatItem
        label="Streak"
        value={`${stats.currentStreak}🔥`}
        color="#E8356D"
      />
      <div className="w-px h-8 bg-white/10" />
      <StatItem
        label="Accuracy"
        value={
          stats.totalCorrect + stats.totalWrong > 0
            ? `${Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100)}%`
            : "—"
        }
        color="#059669"
      />
    </motion.div>
  );
}

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <p className="text-lg font-black" style={{ color }}>
        {value}
      </p>
      <p className="text-[10px] text-white/40 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}
