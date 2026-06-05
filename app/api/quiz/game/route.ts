import { auth } from "@/lib/auth";
import { GameType } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateLocalQuestions } from "@/lib/quiz/local-generator";
import { quizCreationSchema } from "@/lib/quiz/schema";

export async function POST(
  req: Request,
  ) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { topic, type, amount } = quizCreationSchema.parse(body);
    
    const game = await db.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId,
        topic,
      },
    });

    await db.topic_count.upsert({
      where: {
        topic,
      },
      create: {
        topic,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });

    const questions = generateLocalQuestions(topic, amount, type);

    if (type === "mcq") {
      const manyData = questions.map((question) => {
        const options = question.options ?? [question.answer];
        
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: GameType.mcq,
        };
      });

      await db.question.createMany({
        data: manyData,
      });
    } else if (type === "open_ended") {
      await db.question.createMany({
        data: questions.map((question) => {
          return {
            question: question.question,
            answer: question.answer,
            gameId: game.id,
            questionType: GameType.open_ended,
          };
        }),
      });
    }

    return NextResponse.json({ gameId: game.id }, { status: 200 });

  } catch (error) {
    console.log("[Quiz/GAME]", error);
    return new NextResponse(error as string, { status: 500 });
  }
}
