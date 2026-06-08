import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GameType } from "@prisma/client";

import { db } from "@/lib/db";
import { getDemoGameWithQuestions } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";
import MCQ from "../../_components/mcq";

type Props = {
  params: Promise<{
    gameId: string;
  }>;
};

const MCQPage = async ({ params }: Props) => {
  const { gameId } = await params;
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const game =
    isDemoMode && !hasDatabaseUrl
      ? null
      : await db.game.findFirst({
          where: {
            id: gameId,
            userId,
          },
          include: {
            questions: {
              select: {
                id: true,
                question: true,
                options: true,
                answer: true,
              },
            },
          },
        }).catch((error) => {
          console.log("[QUIZ_MCQ_PAGE]", error);
          return null;
        });

  const playableGame =
    game ?? (isDemoMode ? getDemoGameWithQuestions(gameId, userId) : null);

  if (!playableGame || playableGame.gameType !== GameType.mcq) {
    return redirect("/quiz");
  }
  return <MCQ game={playableGame} />;
};

export default MCQPage;
