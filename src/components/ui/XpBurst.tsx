"use client";

import { motion, AnimatePresence } from "framer-motion";

type XpBurstProps = {
  amount: number;
  show: boolean;
};

export function XpBurst({ amount, show }: XpBurstProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -60, scale: 1.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 font-black text-2xl text-yellow-400 pointer-events-none z-50"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
        >
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
