"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getComboTier, COMBO_CONFIG } from "@/lib/gamification";

type ComboCounterProps = {
  streak: number;
};

export function ComboCounter({ streak }: ComboCounterProps) {
  const tier = getComboTier(streak);
  const config = COMBO_CONFIG[tier];

  if (tier === "none") return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`combo-${streak}`}
        initial={{ opacity: 0, scale: 0.3, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${config.color}33, ${config.color}11)`,
          border: `2px solid ${config.color}66`,
          boxShadow: config.glow,
        }}
      >
        <motion.span
          animate={{
            scale: [1, 1.3, 1],
            rotate: tier === "legendary" ? [0, -10, 10, 0] : [0, -5, 5, 0],
          }}
          transition={{
            duration: tier === "legendary" ? 0.4 : 0.3,
            repeat: Infinity,
            repeatDelay: tier === "legendary" ? 0.6 : 1,
          }}
          className="text-lg"
        >
          {config.emoji}
        </motion.span>
        <div className="flex items-baseline gap-1">
          <motion.span
            className="text-xl font-black tabular-nums"
            style={{ color: config.color }}
            key={streak}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {streak}×
          </motion.span>
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: `${config.color}cc` }}
          >
            {config.label}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
