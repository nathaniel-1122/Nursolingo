"use client";

import { motion, AnimatePresence } from "framer-motion";

type VictoryBurstProps = {
  show: boolean;
  phraseName?: string;
};

const STAR_COLORS = ["#F59E0B", "#E8356D", "#A855F7", "#06B6D4", "#10B981"];

export function VictoryBurst({ show, phraseName }: VictoryBurstProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
          {/* Expanding ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-24 h-24 rounded-full border-4 border-amber-400"
          />

          {/* Star particles */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 100 + Math.random() * 40;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  rotate: 360,
                }}
                transition={{ duration: 0.7 + Math.random() * 0.3, ease: "easeOut" }}
                className="absolute text-lg"
              >
                <span style={{ color: STAR_COLORS[i % STAR_COLORS.length] }}>★</span>
              </motion.div>
            );
          })}

          {/* Victory text */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
            className="text-center"
          >
            <motion.p
              className="text-3xl font-black"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #E8356D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "none",
                filter: "drop-shadow(0 2px 8px rgba(245,158,11,0.4))",
              }}
            >
              VICTORY!
            </motion.p>
            {phraseName && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-amber-300/70 mt-1 max-w-[200px] truncate"
              >
                You conquered this one! 🎉
              </motion.p>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
