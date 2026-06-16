import React from "react";
import Link from "next/link";
import { Clock, CopyCheck, Edit2, Sparkles } from "lucide-react";

import { db } from "@/lib/db";
import { getDemoGames } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

type Props = {
  limit: number;
  userId: string;
};

const HistoryComponent = async ({ limit, userId }: Props) => {
  const games =
    isDemoMode && !hasDatabaseUrl
      ? getDemoGames(userId, limit)
      : await db.game.findMany({
          take: limit,
          where: {
            userId,
          },
          orderBy: {
            timeStarted: "desc",
          },
        }).catch((error) => {
          console.log("[QUIZ_HISTORY_FULL]", error);
          return isDemoMode ? getDemoGames(userId, limit) : [];
        });
  
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-y-3 rounded-xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
          No attempts yet
        </p>
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Take your first quiz to begin building your practice history.
        </p>
        <Link
          href="/quiz/create"
          className="text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-400"
        >
          Create a quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {games.map((game) => {
        return (
          <Link
            href={`/quiz/statistics/${game.id}`}
            key={game.id}
            className="group flex items-center gap-x-4 rounded-xl border border-slate-200 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-800"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
              {game.gameType === "mcq" ? (
                <CopyCheck className="h-5 w-5" />
              ) : (
                <Edit2 className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="truncate text-base font-semibold leading-none text-slate-900 transition-colors group-hover:text-teal-600 dark:text-slate-100 dark:group-hover:text-teal-400">
                {game.topic}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex w-fit items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  {new Date(game.timeEnded ?? 0).toLocaleDateString()}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {game.gameType === "mcq" ? "Multiple choice" : "Open-ended"}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default HistoryComponent;
