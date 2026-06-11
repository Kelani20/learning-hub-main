import { z } from "zod";
import { NextResponse } from "next/server";
import stringSimilarity from "string-similarity";

import { db } from "@/lib/db";
import { getDemoGameWithQuestions } from "@/lib/demo-data";
import { isDemoMode } from "@/lib/env";
import { auth } from "@/lib/auth";

const checkAnswerSchema = z.object({
  userInput: z.string(),
  questionId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { questionId, userInput } = checkAnswerSchema.parse(body);

    if (isDemoMode && questionId.startsWith("demo-question-")) {
      const gameId = questionId.replace(/^demo-question-\d+-/, "");
      const demoGame = getDemoGameWithQuestions(gameId, userId);
      const question = demoGame?.questions.find(
        (candidate) => candidate.id === questionId
      );

      if (!question) {
        return NextResponse.json({ message: "Question not found" }, { status: 404 });
      }

      if (question.questionType === "mcq") {
        return NextResponse.json({
          isCorrect:
            question.answer.toLowerCase().trim() ===
            userInput.toLowerCase().trim(),
        });
      }

      const percentageSimilar = Math.round(
        stringSimilarity.compareTwoStrings(
          question.answer.toLowerCase().trim(),
          userInput.toLowerCase().trim()
        ) * 100
      );

      return NextResponse.json({ percentageSimilar });
    }

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
