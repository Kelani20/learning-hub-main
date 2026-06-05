import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import QuizMeCard from "./_components/quiz-me-card";
import HistoryCard from "./_components/history-card";
import HotTopicsCard from "./_components/hot-topics-card";
import RecentActivityCard from "./_components/recent-activity-card";

const QuizPage = () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <div className="min-h-full bg-slate-50">
      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
            Practice lab
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
            Quiz yourself with local generated prompts.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            The demo quiz engine works without paid AI keys, saves attempts, and keeps
            topic activity visible.
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <QuizMeCard />
          <HistoryCard />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <HotTopicsCard />
          <RecentActivityCard />
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
