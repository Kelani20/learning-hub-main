import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GameType } from "@prisma/client";

import { db } from "@/lib/db";
import { getDemoGameWithQuestions } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";
import OpenEnded from "../../_components/open-ended";

const OpenEndedPage = async ({
  params
}: {
  params: Promise<{
    gameId: string;
  }>;
}) => {
  const { gameId } = await params;
  const { userId } = await auth();

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
                answer: true,
              },
            },
          },
        }).catch((error) => {
          console.log("[QUIZ_OPEN_ENDED_PAGE]", error);
          return null;
        });

  const playableGame =
    game ?? (isDemoMode ? getDemoGameWithQuestions(gameId, userId) : null);

  if (!playableGame || playableGame.gameType !== GameType.open_ended) {
    return redirect("/quiz");
  }
  
  return <OpenEnded game={playableGame} />;
};

export default OpenEndedPage;
