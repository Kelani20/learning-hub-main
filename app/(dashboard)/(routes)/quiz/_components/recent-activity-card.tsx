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
  const { userId } = auth();
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
    <Card className="col-span-4 border-slate-200 bg-white shadow-sm lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-black tracking-normal text-slate-950">
          <Link href="/quiz/history">Recent Activity</Link>
        </CardTitle>
        <CardDescription className="text-slate-600">
          You have played a total of {games_count} quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-auto">
        <History limit={10} userId={userId} />
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
