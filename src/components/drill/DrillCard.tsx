"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Phrase } from "@/lib/phrases";
import { CATEGORY_META } from "@/lib/phrases";
import { Particles } from "@/components/ui/Particles";
import { XpBurst } from "@/components/ui/XpBurst";

type DrillCardProps = {
  phrase: Phrase;
  onAnswer: (isCorrect: boolean, responseMs: number, userAnswer: string) => void;
  cardIndex: number;
};

type FeedbackState = "idle" | "checking" | "correct" | "wrong" | "revealed";

export function DrillCard({ phrase, onAnswer, cardIndex }: DrillCardProps) {
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [feedbackText, setFeedbackText] = useState("");
  const [showParticles, setShowParticles] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    setUserInput("");
    setFeedback("idle");
    setFeedbackText("");
    setShowParticles(false);
    setShowXp(false);
    inputRef.current?.focus();
  }, [phrase.id, cardIndex]);

  const handleSubmit = useCallback(async () => {
    if (feedback !== "idle" || !userInput.trim()) return;

    setFeedback("checking");
    const responseMs = Date.now() - startTimeRef.current;

    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: userInput,
          correctAnswer: phrase.spanish,
          englishPrompt: phrase.english,
          context: phrase.context,
        }),
      });

      const data = (await res.json()) as {
        isCorrect: boolean;
        feedback: string;
      };

      setFeedbackText(data.feedback);

      if (data.isCorrect) {
        setFeedback("correct");
        setShowParticles(true);
        const xp = 10;
        setXpAmount(xp);
        setShowXp(true);
        setTimeout(() => {
          setShowParticles(false);
          setShowXp(false);
          onAnswer(true, responseMs, userInput);
        }, 1200);
      } else {
        setFeedback("wrong");
      }
    } catch {
      setFeedback("wrong");
      setFeedbackText("Couldn't check — try again");
    }
  }, [feedback, userInput, phrase.spanish, phrase.english, phrase.context, onAnswer]);

  const handleReveal = useCallback(() => {
    setFeedback("revealed");
    const responseMs = Date.now() - startTimeRef.current;
    setTimeout(() => {
      onAnswer(false, responseMs, userInput);
    }, 2500);
  }, [onAnswer, userInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (feedback === "idle") {
          handleSubmit();
        }
      }
    },
    [feedback, handleSubmit],
  );

  const categoryMeta = CATEGORY_META[phrase.category];

  const cardBg =
    feedback === "correct"
      ? "from-emerald-500/20 to-emerald-600/10 border-emerald-400"
      : feedback === "wrong"
        ? "from-red-500/20 to-red-600/10 border-red-400"
        : feedback === "revealed"
          ? "from-amber-500/20 to-amber-600/10 border-amber-400"
          : feedback === "checking"
            ? "from-purple-500/20 to-purple-600/10 border-purple-400"
            : "from-white/10 to-white/5 border-white/20";

  return (
    <motion.div
      key={`${phrase.id}-${cardIndex}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full max-w-lg mx-auto"
    >
      <div
        className={`relative rounded-3xl border-2 bg-gradient-to-b ${cardBg} backdrop-blur-sm p-6 shadow-xl transition-colors duration-300`}
      >
        <Particles show={showParticles} color={categoryMeta.color} />
        <XpBurst amount={xpAmount} show={showXp} />

        {/* Category tag */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: categoryMeta.color }}
          >
            {categoryMeta.emoji} {categoryMeta.label}
          </span>
          <span className="text-xs text-white/50">
            {"⭐".repeat(phrase.difficulty)}
          </span>
        </div>

        {/* English prompt */}
        <div className="mb-2">
          <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-1">
            How do you say...
          </p>
          <p className="text-xl font-bold text-white leading-snug">
            {phrase.english}
          </p>
        </div>

        {/* Context hint */}
        <p className="text-xs text-white/40 mb-5 italic">{phrase.context}</p>

        {/* Input area */}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type in Spanish..."
            disabled={feedback !== "idle"}
            rows={2}
            className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400/50 resize-none text-base disabled:opacity-60"
          />
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-3">
          {feedback === "checking" && (
            <div className="w-full flex items-center justify-center gap-3 py-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-purple-300 border-t-transparent rounded-full"
              />
              <span className="text-purple-300 font-semibold">Checking...</span>
            </div>
          )}

          {feedback === "idle" && (
            <>
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="flex-1 py-3 rounded-2xl font-bold text-white text-base transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: userInput.trim()
                    ? categoryMeta.color
                    : "rgba(255,255,255,0.1)",
                }}
              >
                Check
              </button>
              <button
                onClick={handleReveal}
                className="px-4 py-3 rounded-2xl font-semibold text-white/60 bg-white/10 hover:bg-white/20 transition-all text-sm"
              >
                Show Answer
              </button>
            </>
          )}

          {feedback === "wrong" && (
            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-red-300">
                <span className="text-lg">✗</span>
                <span className="font-semibold">
                  {feedbackText || "Not quite!"}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setFeedback("idle");
                    setFeedbackText("");
                    setUserInput("");
                    inputRef.current?.focus();
                  }}
                  className="flex-1 py-3 rounded-2xl font-bold text-white bg-white/20 hover:bg-white/30 transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={handleReveal}
                  className="px-4 py-3 rounded-2xl font-semibold text-white/60 bg-white/10 hover:bg-white/20 transition-all text-sm"
                >
                  Show Answer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Correct feedback */}
        <AnimatePresence>
          {feedback === "correct" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 flex items-center gap-2 text-emerald-300"
            >
              <motion.span
                initial={{ rotate: -20 }}
                animate={{ rotate: 0 }}
                className="text-2xl"
              >
                ✓
              </motion.span>
              <span className="font-bold text-lg">
                {feedbackText || "Perfect!"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed answer */}
        <AnimatePresence>
          {feedback === "revealed" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2"
            >
              <p className="text-xs uppercase tracking-wider text-amber-300/60 font-semibold">
                Correct answer:
              </p>
              <p className="text-lg text-amber-200 font-semibold leading-snug">
                {phrase.spanish}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
