"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSounds } from "@/hooks/useSounds";
import { SOUND_CATEGORIES, SoundEffects, type SoundCategory } from "@/lib/sounds";

type SoundSettingsProps = {
  onClose: () => void;
};

const CATEGORY_ICONS: Record<SoundCategory, string> = {
  answers: "🎯",
  combos: "🔥",
  celebrations: "🎉",
  ui: "👆",
};

export function SoundSettings({ onClose }: SoundSettingsProps) {
  const { settings, toggleMaster, toggleCategory, play } = useSounds();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#2a1f4e] to-[#1a1033] rounded-t-3xl sm:rounded-3xl border border-white/10 p-6 pb-8 max-h-[85dvh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white">🔊 Sound Settings</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all text-sm"
            >
              ✕
            </button>
          </div>

          {/* Master toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
            <div>
              <p className="font-bold text-white">Master Volume</p>
              <p className="text-xs text-white/40 mt-0.5">
                {settings.masterEnabled ? "All sounds on" : "All sounds muted"}
              </p>
            </div>
            <button
              onClick={toggleMaster}
              className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                settings.masterEnabled
                  ? "bg-gradient-to-r from-pink-500 to-purple-500"
                  : "bg-white/10"
              }`}
            >
              <motion.div
                animate={{ x: settings.masterEnabled ? 24 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
              />
            </button>
          </div>

          {/* Category toggles */}
          <div className="space-y-3">
            {(Object.entries(SOUND_CATEGORIES) as [SoundCategory, typeof SOUND_CATEGORIES[SoundCategory]][]).map(
              ([key, config]) => {
                const enabled = settings.masterEnabled && settings.categories[key];
                return (
                  <div
                    key={key}
                    className={`rounded-2xl border transition-all duration-200 ${
                      settings.masterEnabled
                        ? "bg-white/5 border-white/10"
                        : "bg-white/[0.02] border-white/5 opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xl">{CATEGORY_ICONS[key]}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm">
                            {config.label}
                          </p>
                          <p className="text-xs text-white/40 truncate">
                            {config.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Preview button */}
                        <button
                          onClick={() => {
                            const previewSound = config.sounds[0];
                            SoundEffects[previewSound]();
                          }}
                          disabled={!settings.masterEnabled}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                          title="Preview sound"
                        >
                          ▶
                        </button>

                        {/* Toggle */}
                        <button
                          onClick={() => toggleCategory(key)}
                          disabled={!settings.masterEnabled}
                          className={`relative w-12 h-7 rounded-full transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                            enabled
                              ? "bg-gradient-to-r from-pink-500 to-purple-500"
                              : "bg-white/10"
                          }`}
                        >
                          <motion.div
                            animate={{ x: settings.categories[key] ? 20 : 3 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>

          {/* Test all sounds */}
          <button
            onClick={() => {
              play("correct");
              setTimeout(() => play("comboWarm"), 400);
              setTimeout(() => play("xpGain"), 700);
            }}
            disabled={!settings.masterEnabled}
            className="w-full mt-5 py-3 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-white/10 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            🎵 Test Sound Preview
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
