"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { PhraseCategory } from "@/lib/phrases";
import { getCategories, PHRASES } from "@/lib/phrases";
import { CategoryCard } from "@/components/home/CategoryCard";
import { StatsBar } from "@/components/home/StatsBar";
import { DrillSession } from "@/components/drill/DrillSession";
import { getAllWordStats } from "@/lib/storage";
import { getDueCount } from "@/lib/srs";

type AppView =
  | { mode: "home" }
  | { mode: "drill"; category: PhraseCategory | "all" | "weak" };

export default function Home() {
  const [view, setView] = useState<AppView>({ mode: "home" });
  const [dueCount, setDueCount] = useState<number | null>(null);

  useEffect(() => {
    if (view.mode === "home") {
      getAllWordStats().then((allStats) => {
        const statsMap = new Map(allStats.map((s) => [s.phraseId, s]));
        setDueCount(getDueCount(PHRASES, statsMap));
      });
    }
  }, [view]);

  if (view.mode === "drill") {
    return (
      <DrillSession
        category={view.category}
        onExit={() => setView({ mode: "home" })}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-dvh px-4 py-6 max-w-lg mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
          Nursolingo
        </h1>
        <p className="text-sm text-white/40 mt-1">
          NICU Medical Spanish Trainer
        </p>
      </motion.div>

      {/* Stats */}
      <div className="mb-6">
        <StatsBar />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setView({ mode: "drill", category: "all" })}
          className="relative overflow-hidden rounded-2xl p-4 text-left"
          style={{
            background: "linear-gradient(135deg, #E8356Ddd, #7C3AEDaa)",
          }}
        >
          <span className="text-2xl block mb-1">🚀</span>
          <p className="text-sm font-bold text-white">Quick Mix</p>
          <p className="text-[10px] text-white/60">8 phrases, ~3 min</p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setView({ mode: "drill", category: "weak" })}
          className="relative overflow-hidden rounded-2xl p-4 text-left"
          style={{
            background: "linear-gradient(135deg, #F59E0Bdd, #DC2626aa)",
          }}
        >
          <span className="text-2xl block mb-1">🧠</span>
          <p className="text-sm font-bold text-white">Smart Review</p>
          <p className="text-[10px] text-white/60">
            {dueCount !== null ? `${dueCount} due` : "~3 min"}
          </p>
        </motion.button>
      </div>

      {/* Category section header */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3"
      >
        Categories
      </motion.h2>

      {/* Category grid */}
      <div className="grid grid-cols-2 gap-3 pb-8">
        {getCategories().map((cat, i) => (
          <CategoryCard
            key={cat}
            category={cat}
            index={i}
            onSelect={(c) => setView({ mode: "drill", category: c })}
          />
        ))}
      </div>
    </div>
  );
}
