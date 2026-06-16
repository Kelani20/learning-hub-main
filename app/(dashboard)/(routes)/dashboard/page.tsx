import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Compass,
  CreditCard,
  MessageSquare,
  PlayCircle,
  Plug,
  Sparkles,
  Target,
} from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { Button } from "@/components/ui/button";
import { getConnectorSummary } from "@/lib/connectors";
import { InfoCard } from "./_components/info-card";

const DashboardPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const {
    completedCourses,
    coursesInProgress,
  } = await getDashboardCourses(userId);
  const connectorSummary = getConnectorSummary();
  const allCourses = [...coursesInProgress, ...completedCourses];
  const averageProgress =
    allCourses.length > 0
      ? Math.round(
          allCourses.reduce((total, course) => total + (course.progress ?? 0), 0) /
            allCourses.length
        )
      : 0;
  const totalChapters = allCourses.reduce(
    (total, course) => total + course.chapters.length,
    0
  );
  const focusCourse = coursesInProgress[0] ?? completedCourses[0];

  return (
    <div className="min-h-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
      <section className="motion-rise glass-panel mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-elevate-dark dark:border-slate-800">
        <div className="grid gap-6 bg-grid-faint p-6 lg:grid-cols-[1.35fr_0.65fr] lg:p-8">
          <div>
            <p className="inline-flex items-center gap-x-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-sm font-bold text-teal-200">
              <Sparkles className="h-4 w-4" />
              Learner workspace
            </p>
            <h2 className="mt-5 max-w-3xl text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Your learning command center.
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-300">
              Continue lessons, launch practice, follow discussions, and manage every
              integration from one focused workspace.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link href={focusCourse ? `/courses/${focusCourse.id}` : "/browse"}>
                <Button className="keep-light h-11 cursor-pointer rounded-full bg-teal-500 px-5 font-bold text-slate-950 shadow-glow transition hover:-translate-y-0.5 hover:bg-teal-400">
                  Continue learning
                  <PlayCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/integrations">
                <Button
                  variant="outline"
                  className="h-11 cursor-pointer rounded-full border-white/20 bg-white/10 px-5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15 hover:text-white"
                >
                  Integrations
                  <Plug className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Avg progress", value: `${averageProgress}%` },
              { label: "Chapters", value: totalChapters },
              { label: "Connectors live", value: connectorSummary.ready },
              { label: "Practice", value: "Adaptive" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-teal-400/30 hover:bg-white/10"
              >
                <p className="text-2xl font-black tracking-tight">{item.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={Clock}
          label="In progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {[
          {
            icon: Target,
            label: "Next focus",
            title: focusCourse?.title ?? "Pick a course",
            body: focusCourse
              ? "Open the course, finish the next chapter, then lock it in with a quiz."
              : "Browse the catalog and enroll in a path to start tracking your progress.",
            href: focusCourse ? `/courses/${focusCourse.id}` : "/browse",
            cta: "Open path",
          },
          {
            icon: BarChart3,
            label: "Momentum",
            title: `${completedCourses.length} completed, ${coursesInProgress.length} active`,
            body:
              "Progress, completions, and practice history are tracked across your workspace.",
            href: "/quiz",
            cta: "Practice now",
          },
          {
            icon: CreditCard,
            label: "Checkout",
            title: "Secure checkout",
            body:
              "Enroll in paid courses through an encrypted checkout and get instant access to every chapter.",
            href: "/checkout/course_product_analytics",
            cta: "Enroll now",
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="product-surface group cursor-pointer rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5 hover:border-teal-500/40 hover:shadow-lg dark:hover:border-teal-400/30"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 transition group-hover:bg-teal-500 group-hover:text-white dark:text-teal-300">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-600 dark:text-teal-300">
                  {item.label}
                </p>
                <h3 className="mt-1 text-lg font-black tracking-tight text-slate-950 dark:text-white">
                  {item.title}
                </h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.body}</p>
            <span className="mt-5 inline-flex items-center text-sm font-bold text-teal-600 transition group-hover:gap-x-1 dark:text-teal-300">
              {item.cta}
              <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>

      <div className="mt-8 mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
            Your courses
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Continue a lesson or open a course overview.
          </p>
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          <Link href="/discussions" className="inline-flex items-center text-sm font-bold text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
            Discussions
            <MessageSquare className="ml-1 h-4 w-4" />
          </Link>
          <Link href="/browse" className="group inline-flex items-center text-sm font-bold text-teal-600 transition hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200">
            Browse all
            <Compass className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
      <CoursesList
        items={allCourses}
      />
      <section className="mt-8 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="product-surface rounded-2xl p-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-600 dark:text-teal-300">
            Supabase platform
          </p>
          <h3 className="mt-2 text-balance text-xl font-black tracking-tight text-slate-950 dark:text-white">
            Auth, database, storage, realtime, functions, and vector search, ready to connect.
          </h3>
          <p className="mt-3 text-pretty text-sm leading-6 text-slate-600 dark:text-slate-400">
            Learning Hub runs end to end out of the box, and the integrations hub shows exactly
            where Supabase plugs in to power production data and automation.
          </p>
        </div>
        <Link
          href="/integrations"
          className="glass-panel group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white shadow-elevate-dark transition duration-200 hover:-translate-y-0.5 hover:shadow-glow"
        >
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-300">
            Everything Learning Hub connects to
          </p>
          <h3 className="mt-2 text-balance text-xl font-black tracking-tight">
            {connectorSummary.ready} live now, {connectorSummary.needsSetup} available to connect.
          </h3>
          <span className="mt-5 inline-flex items-center text-sm font-bold text-teal-200 transition group-hover:text-white">
            Review Supabase and provider setup
            <Plug className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>
    </div>
  );
}
 
export default DashboardPage;
