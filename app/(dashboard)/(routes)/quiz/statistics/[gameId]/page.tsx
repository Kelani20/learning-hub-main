import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LucideLayoutDashboard } from "lucide-react";

import { db } from "@/lib/db";
import { getDemoGameWithQuestions } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";
import { buttonVariants } from "@/components/ui/button";
import ResultsCard from "../_components/result-card";
import AccuracyCard from "../_components/accuracy-card";
import TimeTakenCard from "../_components/time-taken-card";
import QuestionsList from "../_components/questions-list";

const Statistics = async ({ 
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
            questions: true,
          },
        }).catch((error) => {
          console.log("[QUIZ_STATISTICS]", error);
          return null;
        });

  const summaryGame =
    game ?? (isDemoMode ? getDemoGameWithQuestions(gameId, userId, true) : null);

  if (!summaryGame) {
    return redirect("/quiz");
  }

  let accuracy: number = 0;

  if (summaryGame.gameType === "mcq") {
    let totalCorrect = summaryGame.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
    accuracy = (totalCorrect / summaryGame.questions.length) * 100;
  } else if (summaryGame.gameType === "open_ended") {
    let totalPercentage = summaryGame.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0);
    accuracy = totalPercentage / summaryGame.questions.length;
  }
  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
          <div className="flex items-center space-x-2">
            <Link href="/quiz" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard
            timeEnded={new Date(summaryGame.timeEnded ?? 0)}
            timeStarted={new Date(summaryGame.timeStarted ?? 0)}
          />
        </div>
        <QuestionsList questions={summaryGame.questions} />
      </div>
    </>
  );
};

export default Statistics;
