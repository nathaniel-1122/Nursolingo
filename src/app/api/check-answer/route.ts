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
    max_tokens: 150,
    system: `You are a medical Spanish language evaluator for NICU nurses. Evaluate whether the user's Spanish answer conveys the same meaning as the target phrase. Be generous with minor spelling/accent errors and acceptable synonyms, but the core medical meaning must be correct.

Respond ONLY with valid JSON in this exact format:
{"isCorrect": true/false, "feedback": "brief feedback"}

For feedback:
- If correct: one short encouraging note (e.g. "Perfect!" or "Great — same meaning, slightly different phrasing")
- If wrong: explain what was off in 10 words or fewer`,
    messages: [
      {
        role: "user",
        content: `English prompt: "${englishPrompt}"
Context: ${context}
Target Spanish answer: "${correctAnswer}"
User's Spanish answer: "${userAnswer}"

Is the user's answer semantically correct?`,
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

  const raw = textBlock.text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const parsed = JSON.parse(raw) as CheckAnswerResponse;

  return NextResponse.json({
    isCorrect: parsed.isCorrect,
    feedback: parsed.feedback,
  });
}
