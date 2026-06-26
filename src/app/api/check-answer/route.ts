import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic();

interface CheckAnswerRequest {
  userAnswer: string;
  correctAnswer: string;
  englishPrompt: string;
  context: string;
}

interface CheckAnswerResponse {
  isCorrect: boolean;
  feedback: string;
  rationale: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 },
    );
  }

  const body = (await request.json()) as CheckAnswerRequest;
  const { userAnswer, correctAnswer, englishPrompt, context } = body;

  if (!userAnswer || !correctAnswer || !englishPrompt) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 400,
    system: `You are a medical Spanish language evaluator and tutor for NICU nurses. Evaluate whether the user's Spanish answer conveys the same meaning as the target phrase. Be generous with minor spelling/accent errors and acceptable synonyms, but the core medical meaning must be correct.

Respond ONLY with valid JSON in this exact format:
{"isCorrect": true/false, "feedback": "short verdict", "rationale": "detailed explanation"}

Rules for "feedback": one short line (under 15 words).
- If correct: encouraging note (e.g. "Perfect!" or "Correct — slightly different phrasing but same meaning")
- If wrong: brief statement of what's off

Rules for "rationale": a detailed teaching explanation (2-4 sentences). ALWAYS include:
- If a wrong TENSE was used: name the tense the user used (e.g. "You used the present tense 'come'") and the tense that was expected (e.g. "but the target uses the preterite 'comió'"). Explain when each tense is used.
- If a wrong WORD was used: explain what the user's word actually means (e.g. "'caliente' means 'hot/spicy'") vs what word was expected and what it means (e.g. "'tibio' means 'warm/lukewarm'").
- If PARTIALLY correct: identify exactly which parts were right and which need fixing.
- If correct but different phrasing: explain why both versions work.
- If accent marks are wrong or missing: note which words need accents and why.
Always be specific — name the exact words, tenses, and meanings. This is for learning.`,
    messages: [
      {
        role: "user",
        content: `English prompt: "${englishPrompt}"
Context: ${context}
Target Spanish answer: "${correctAnswer}"
User's Spanish answer: "${userAnswer}"

Evaluate the user's answer.`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json(
      { error: "No response from evaluator" },
      { status: 500 },
    );
  }

  const raw = textBlock.text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
  const parsed = JSON.parse(raw) as CheckAnswerResponse;

  return NextResponse.json({
    isCorrect: parsed.isCorrect,
    feedback: parsed.feedback,
    rationale: parsed.rationale,
  });
}
