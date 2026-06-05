import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import MCQ from "../../_components/mcq";

type Props = {
  params: {
    gameId: string;
  };
};

const MCQPage = async ({ params: { gameId } }: Props) => {
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
          options: true,
        },
      },
    },
  });

  if (!game || game.gameType === "open_ended") {
    return redirect("/quiz");
  }
  return <MCQ game={game} />;
};

export default MCQPage;
