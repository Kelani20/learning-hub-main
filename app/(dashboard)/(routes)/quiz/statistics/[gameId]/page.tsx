import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LucideLayoutDashboard } from "lucide-react";

import { db } from "@/lib/db";
import { getDemoGameWithQuestions } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl p-6 motion-rise sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-600 dark:text-teal-400">
              {summaryGame.topic}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-balance text-slate-950 dark:text-slate-50">
              Quiz summary
            </h2>
          </div>
          <Link
            href="/quiz"
            className={cn(buttonVariants(), "cursor-pointer rounded-full")}
          >
            <LucideLayoutDashboard className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard
            timeEnded={new Date(summaryGame.timeEnded ?? 0)}
            timeStarted={new Date(summaryGame.timeStarted ?? 0)}
          />
        </div>
        <QuestionsList questions={summaryGame.questions} />
      </div>
    </div>
  );
};

export default Statistics;
