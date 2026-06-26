"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Phrase, PhraseCategory } from "@/lib/phrases";
import { createDrillSession, type DrillResult } from "@/lib/drill-engine";
import { recordAnswer, type SessionStats } from "@/lib/storage";
import { DrillCard } from "./DrillCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CATEGORY_META } from "@/lib/phrases";
import { SessionSummary } from "./SessionSummary";

type DrillSessionProps = {
  category: PhraseCategory | "all" | "weak";
  onExit: () => void;
};

export function DrillSession({ category, onExit }: DrillSessionProps) {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<DrillResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    createDrillSession(category).then((session) => {
      setPhrases(session.phrases);
      setIsLoading(false);
    });
  }, [category]);

  const handleAnswer = useCallback(
    async (isCorrect: boolean, responseMs: number, userAnswer: string) => {
      const phrase = phrases[currentIndex];
      const result: DrillResult = {
        phraseId: phrase.id,
        isCorrect,
        userAnswer,
        responseMs,
      };

      const { sessionStats: updated } = await recordAnswer(
        phrase.id,
        isCorrect,
        responseMs,
      );
      setSessionStats(updated);

      const newResults = [...results, result];
      setResults(newResults);

      if (currentIndex + 1 >= phrases.length) {
        setIsComplete(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [phrases, currentIndex, results],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-3 border-white/20 border-t-pink-400"
        />
      </div>
    );
  }

  if (phrases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white/60">
        <p className="text-lg mb-4">No phrases available for this category.</p>
        <button
          onClick={onExit}
          className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isComplete && sessionStats) {
    return (
      <SessionSummary
        results={results}
        phrases={phrases}
        sessionStats={sessionStats}
        onExit={onExit}
        onRetry={() => {
          setCurrentIndex(0);
          setResults([]);
          setIsComplete(false);
          createDrillSession(category).then((session) => {
            setPhrases(session.phrases);
          });
        }}
      />
    );
  }

  const categoryColor =
    category === "all" || category === "weak"
      ? "#E8356D"
      : CATEGORY_META[category].color;

  return (
    <div className="flex flex-col min-h-[100dvh] px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onExit}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          ✕
        </button>
        <div className="flex-1">
          <ProgressBar
            current={currentIndex}
            total={phrases.length}
            color={categoryColor}
          />
        </div>
        <span className="text-sm text-white/50 font-mono min-w-[3rem] text-right">
          {currentIndex + 1}/{phrases.length}
        </span>
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <DrillCard
            key={`${phrases[currentIndex].id}-${currentIndex}`}
            phrase={phrases[currentIndex]}
            onAnswer={handleAnswer}
            cardIndex={currentIndex}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
