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
    max_tokens: 200,
    system: `Medical Spanish evaluator for NICU nurses. Accept minor spelling/accent errors and valid synonyms; core medical meaning must be correct.

Reply ONLY with JSON: {"isCorrect":bool,"feedback":"<15 words","rationale":"1-2 sentences"}

feedback: encouraging if correct, brief note if wrong.
rationale: name the specific wrong word/tense and what it means vs what was expected. Be concrete, not generic.`,
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
