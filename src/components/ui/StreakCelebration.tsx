"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { DailyStreakMilestone } from "@/lib/gamification";

type StreakCelebrationProps = {
  milestone: DailyStreakMilestone | null;
  currentStreak: number;
  onDismiss: () => void;
};

export function StreakCelebration({
  milestone,
  currentStreak,
  onDismiss,
}: StreakCelebrationProps) {
  const show = milestone !== null;

  return (
    <AnimatePresence>
      {show && milestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative flex flex-col items-center gap-4 p-8 rounded-3xl max-w-xs mx-4"
            style={{
              background: "linear-gradient(160deg, #1a1025 0%, #0f0a18 100%)",
              border: "2px solid rgba(245,158,11,0.3)",
              boxShadow:
                "0 0 60px rgba(245,158,11,0.15), 0 0 120px rgba(232,53,109,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating emoji */}
            <motion.span
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              {milestone.emoji}
            </motion.span>

            <div className="text-center">
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-black bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent"
              >
                {milestone.label}
              </motion.h2>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-white/50 text-sm mt-2"
              >
                {currentStreak} days in a row — keep it up!
              </motion.p>
            </div>

            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onDismiss}
              className="mt-2 px-8 py-3 rounded-2xl font-bold text-white text-sm"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #E8356D)",
              }}
            >
              Let&apos;s Go!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
