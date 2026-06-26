"use client";

import { motion } from "framer-motion";
import type { PhraseCategory } from "@/lib/phrases";
import { CATEGORY_META, getPhrasesByCategory } from "@/lib/phrases";

type CategoryCardProps = {
  category: PhraseCategory;
  index: number;
  onSelect: (category: PhraseCategory) => void;
};

export function CategoryCard({ category, index, onSelect }: CategoryCardProps) {
  const meta = CATEGORY_META[category];
  const phraseCount = getPhrasesByCategory(category).length;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(category)}
      className="relative overflow-hidden rounded-2xl p-5 text-left transition-shadow hover:shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${meta.color}dd, ${meta.color}88)`,
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20"
        style={{ backgroundColor: "white" }}
      />
      <div
        className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full opacity-10"
        style={{ backgroundColor: "white" }}
      />

      <span className="text-3xl block mb-2">{meta.emoji}</span>
      <h3 className="text-lg font-bold text-white mb-1">{meta.label}</h3>
      <p className="text-xs text-white/70 mb-3">{meta.description}</p>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-white/50 font-mono">
          {phraseCount} phrases
        </span>
      </div>
    </motion.button>
  );
}
