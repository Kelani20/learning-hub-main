import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import QuizMeCard from "./_components/quiz-me-card";
import HistoryCard from "./_components/history-card";
import HotTopicsCard from "./_components/hot-topics-card";
import RecentActivityCard from "./_components/recent-activity-card";

const QuizPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="motion-rise mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm product-surface dark:border-slate-800">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-600 dark:text-teal-400">
            Adaptive practice
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-balance text-slate-950 dark:text-slate-50">
            Quiz yourself with instant, adaptive questions.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-pretty text-slate-600 dark:text-slate-400">
            The practice engine builds quizzes on any topic in seconds, saves every
            attempt, and keeps your trending subjects in view.
          </p>
        </div>
        <div className="motion-rise-delay-1 mt-4 grid gap-4 md:grid-cols-2">
          <QuizMeCard />
          <HistoryCard />
        </div>
        <div className="motion-rise-delay-2 mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <HotTopicsCard />
          <RecentActivityCard />
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
