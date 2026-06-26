"use client";

import { motion, AnimatePresence } from "framer-motion";

type ParticlesProps = {
  show: boolean;
  color?: string;
};

const PARTICLE_COLORS = ["#E8356D", "#F59E0B", "#7C3AED", "#059669", "#0891B2"];

export function Particles({ show, color }: ParticlesProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 80 + Math.random() * 60;
            const size = 6 + Math.random() * 10;
            const particleColor =
              color ?? PARTICLE_COLORS[i % PARTICLE_COLORS.length];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                }}
                transition={{
                  duration: 0.6 + Math.random() * 0.3,
                  ease: "easeOut",
                }}
                className="absolute top-1/2 left-1/2 rounded-full"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: particleColor,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
