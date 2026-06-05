import { NextResponse } from "next/server";

import { generateLocalQuestions } from "@/lib/quiz/local-generator";
import { quizCreationSchema } from "@/lib/quiz/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);

    return NextResponse.json(
      { questions: generateLocalQuestions(topic, amount, type) },
      { status: 200 }
    );
  } catch {
    return new NextResponse("Invalid quiz request", { status: 400 });
  }
}
