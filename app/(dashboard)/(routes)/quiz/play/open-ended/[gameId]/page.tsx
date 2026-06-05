import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import OpenEnded from "../../_components/open-ended";

const OpenEndedPage = async ({
  params
}: {
  params: Promise<{
    gameId: string;
  }>;
}) => {
  const { gameId } = await params;
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const game = await db.game.findFirst({
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
  });

  if (!game || game.gameType === "mcq") {
    return redirect("/quiz");
  }
  
  return <OpenEnded game={game} />;
};

export default OpenEndedPage;
