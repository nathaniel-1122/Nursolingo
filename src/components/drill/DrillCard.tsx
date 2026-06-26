"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Phrase } from "@/lib/phrases";
import { CATEGORY_META } from "@/lib/phrases";
import { Particles } from "@/components/ui/Particles";
import { XpBurst } from "@/components/ui/XpBurst";
import { VictoryBurst } from "@/components/ui/VictoryBurst";
import { savePhraseOverride } from "@/lib/storage";
import { calculateXpWithCombo, getComboTier, COMBO_CONFIG } from "@/lib/gamification";

type DrillCardProps = {
  phrase: Phrase;
  onAnswer: (isCorrect: boolean, responseMs: number, userAnswer: string) => void;
  onNext: () => void;
  cardIndex: number;
  comboStreak?: number;
  isVictory?: boolean;
};

type FeedbackState = "idle" | "checking" | "correct" | "wrong" | "revealed";
type AnswerView = "mine" | "correct";

export function DrillCard({
  phrase,
  onAnswer,
  onNext,
  cardIndex,
  comboStreak = 0,
  isVictory = false,
}: DrillCardProps) {
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [feedbackText, setFeedbackText] = useState("");
  const [rationale, setRationale] = useState("");
  const [showParticles, setShowParticles] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [answerView, setAnswerView] = useState<AnswerView>("mine");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [savedAnswer, setSavedAnswer] = useState("");
  const [hasRecorded, setHasRecorded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef(Date.now());
  const responseMsRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setUserInput("");
    setFeedback("idle");
    setFeedbackText("");
    setRationale("");
    setShowParticles(false);
    setShowXp(false);
    setShowVictory(false);
    setAnswerView("mine");
    setIsEditing(false);
    setEditValue("");
    setSavedAnswer(phrase.spanish);
    setHasRecorded(false);
    inputRef.current?.focus();
  }, [phrase.id, cardIndex, phrase.spanish]);

  useEffect(() => {
    if (isVictory && feedback === "correct") {
      setShowVictory(true);
      const timer = setTimeout(() => setShowVictory(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [isVictory, feedback]);

  useEffect(() => {
    if (isEditing) editRef.current?.focus();
  }, [isEditing]);

  const handleSubmit = useCallback(async () => {
    if (feedback !== "idle" || !userInput.trim()) return;

    setFeedback("checking");
    responseMsRef.current = Date.now() - startTimeRef.current;

    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: userInput,
          correctAnswer: savedAnswer,
          englishPrompt: phrase.english,
          context: phrase.context,
        }),
      });

      const data = (await res.json()) as {
        isCorrect: boolean;
        feedback: string;
        rationale: string;
      };

      setFeedbackText(data.feedback);
      setRationale(data.rationale);

      if (data.isCorrect) {
        setFeedback("correct");
        setShowParticles(true);

        const nextCombo = comboStreak + 1;
        const xpCalc = calculateXpWithCombo(10, nextCombo, 0);
        setXpAmount(xpCalc.total);
        setShowXp(true);

        setTimeout(() => {
          setShowParticles(false);
          setShowXp(false);
        }, 1200);
        onAnswer(true, responseMsRef.current, userInput);
        setHasRecorded(true);
      } else {
        setFeedback("wrong");
        if (!hasRecorded) {
          onAnswer(false, responseMsRef.current, userInput);
          setHasRecorded(true);
        }
      }
    } catch {
      setFeedback("wrong");
      setFeedbackText("Couldn't check — try again");
    }
  }, [
    feedback,
    userInput,
    savedAnswer,
    phrase.english,
    phrase.context,
    onAnswer,
    comboStreak,
    hasRecorded,
  ]);

  const handleReveal = useCallback(() => {
    setFeedback("revealed");
    responseMsRef.current = Date.now() - startTimeRef.current;
    if (!hasRecorded) {
      onAnswer(false, responseMsRef.current, userInput);
      setHasRecorded(true);
    }
  }, [onAnswer, userInput, hasRecorded]);

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

  const handleSaveEdit = useCallback(async () => {
    if (!editValue.trim()) return;
    setSavedAnswer(editValue.trim());
    setIsEditing(false);
    await savePhraseOverride(phrase.id, editValue.trim());
  }, [editValue, phrase.id]);

  const isAnswered =
    feedback === "correct" || feedback === "wrong" || feedback === "revealed";

  const categoryMeta = CATEGORY_META[phrase.category];
  const comboTier = getComboTier(comboStreak + 1);
  const comboConfig = COMBO_CONFIG[comboTier];

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
        style={
          feedback === "correct" && comboTier !== "none"
            ? { boxShadow: comboConfig.glow }
            : undefined
        }
      >
        <Particles
          show={showParticles}
          color={categoryMeta.color}
          count={comboTier !== "none" ? comboConfig.particleCount : 12}
        />
        <XpBurst amount={xpAmount} show={showXp} />
        <VictoryBurst show={showVictory} />

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

        {/* Input area (only when not answered) */}
        {!isAnswered && (
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
        )}

        {/* Answer flip view (after answering) */}
        {isAnswered && (
          <div className="space-y-3">
            {/* Flip toggle */}
            <div className="flex rounded-2xl bg-white/10 p-1 gap-1">
              <button
                onClick={() => setAnswerView("mine")}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                  answerView === "mine"
                    ? "bg-white/20 text-white"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                My Answer
              </button>
              <button
                onClick={() => setAnswerView("correct")}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                  answerView === "correct"
                    ? "bg-white/20 text-white"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                Correct Answer
              </button>
            </div>

            {/* Answer display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={answerView}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl bg-white/10 border border-white/20 px-4 py-3 min-h-[3.5rem]"
              >
                {answerView === "mine" ? (
                  <p className="text-white text-base">
                    {userInput || <span className="text-white/30">(no answer)</span>}
                  </p>
                ) : (
                  <div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          ref={editRef}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none text-base"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/40 transition-all"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1.5 rounded-xl bg-white/10 text-white/50 text-xs font-semibold hover:bg-white/20 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-amber-200 text-base font-semibold">
                          {savedAnswer}
                        </p>
                        <button
                          onClick={() => {
                            setEditValue(savedAnswer);
                            setIsEditing(true);
                          }}
                          className="shrink-0 px-2 py-1 rounded-lg bg-white/10 text-white/40 text-xs hover:text-white/70 hover:bg-white/20 transition-all"
                          title="Edit correct answer"
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

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
            <div className="w-full space-y-2">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setFeedback("idle");
                    setFeedbackText("");
                    setRationale("");
                    setUserInput("");
                    setAnswerView("mine");
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
                <button
                  onClick={onNext}
                  className="px-4 py-3 rounded-2xl font-bold text-white transition-all"
                  style={{ backgroundColor: categoryMeta.color }}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {(feedback === "correct" || feedback === "revealed") && (
            <button
              onClick={onNext}
              className="w-full py-3 rounded-2xl font-bold text-white text-base transition-all hover:brightness-110"
              style={{ backgroundColor: categoryMeta.color }}
            >
              Next →
            </button>
          )}
        </div>

        {/* Feedback verdict */}
        <AnimatePresence>
          {feedback === "correct" && feedbackText && (
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
              <span className="font-bold text-lg">{feedbackText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {feedback === "wrong" && feedbackText && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 text-red-300"
            >
              <span className="text-lg">✗</span>
              <span className="font-semibold">{feedbackText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {feedback === "revealed" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 text-amber-300"
            >
              <span className="text-lg">👀</span>
              <span className="font-semibold">Answer revealed — study it!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rationale section */}
        <AnimatePresence>
          {isAnswered && rationale && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-4"
            >
              <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-2">
                📝 Rationale
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                {rationale}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
