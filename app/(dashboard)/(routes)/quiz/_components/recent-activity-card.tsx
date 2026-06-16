import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { getDemoGames } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";
import History from "./history";

const RecentActivityCard = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const games_count =
    isDemoMode && !hasDatabaseUrl
      ? getDemoGames(userId).length
      : await db.game.count({
          where: {
            userId,
          },
        }).catch((error) => {
          console.log("[RECENT_ACTIVITY_CARD]", error);
          return isDemoMode ? getDemoGames(userId).length : 0;
        });

  return (
    <Card className="col-span-4 rounded-2xl border-slate-200 bg-white shadow-sm product-surface dark:border-slate-800 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-black tracking-normal text-slate-950 dark:text-slate-50">
          <Link
            href="/quiz/history"
            className="rounded-md transition-colors hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:text-teal-400"
          >
            Recent activity
          </Link>
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          You have completed {games_count} {games_count === 1 ? "quiz" : "quizzes"} so far.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-auto">
        <History limit={10} userId={userId} />
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
