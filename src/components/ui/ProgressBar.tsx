"use client";

import { motion } from "framer-motion";

type ProgressBarProps = {
  current: number;
  total: number;
  color?: string;
};

export function ProgressBar({
  current,
  total,
  color = "#E8356D",
}: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </div>
  );
}
