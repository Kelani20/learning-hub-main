import { z } from "zod";
import { NextResponse } from "next/server";
import stringSimilarity from "string-similarity";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const checkAnswerSchema = z.object({
  userInput: z.string(),
  questionId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { questionId, userInput } = checkAnswerSchema.parse(body);
    const question = await db.question.findFirst({
      where: {
        id: questionId,
        game: {
          userId,
        },
      },
    });

    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }
    await db.question.update({
      where: {
        id: questionId,
      },
      data: {
        userAnswers: userInput,
      },
    });
    
    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.toLowerCase().trim() === userInput.toLowerCase().trim();
      await db.question.update({
        where: { 
          id: questionId 
        },
        data: { 
          isCorrect 
        },
      });
      return NextResponse.json({ isCorrect });
    } else if (question.questionType === "open_ended") {
      let percentageSimilar = stringSimilarity.compareTwoStrings(
        question.answer.toLowerCase().trim(),
        userInput.toLowerCase().trim()
      );

      percentageSimilar = Math.round(percentageSimilar * 100);
      await db.question.update({
        where: { 
          id: questionId 
        },
        data: {
          percentageCorrect: percentageSimilar 
        },
      });

      return NextResponse.json({ percentageSimilar });
    }

    return NextResponse.json({ message: "Unsupported question type" }, { status: 400 });
  } catch (error) {
    return new NextResponse(error as string, { status: 500 });
  }
}
