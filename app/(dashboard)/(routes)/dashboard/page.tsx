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
      <section className="mb-6 overflow-hidden rounded-md border border-slate-200 bg-slate-950 text-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.35fr_0.65fr] lg:p-8">
          <div>
            <p className="inline-flex items-center gap-x-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-bold text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Learner workspace
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-normal sm:text-4xl">
              Your learning command center is ready.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Continue lessons, launch practice, check discussions, and inspect the
              production connector posture from one practical workspace.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link href={focusCourse ? `/courses/${focusCourse.id}` : "/browse"}>
                <Button className="keep-light h-11 rounded-full bg-white px-5 font-bold text-slate-950 hover:bg-cyan-50">
                  Continue learning
                  <PlayCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/integrations">
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-white/20 bg-white/10 px-5 font-bold text-white hover:bg-white/15 hover:text-white"
                >
                  Connector hub
                  <Plug className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Avg progress", value: `${averageProgress}%` },
              { label: "Chapters", value: totalChapters },
              { label: "Ready connectors", value: connectorSummary.ready },
              { label: "Practice mode", value: "Local" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-white/10 bg-white/10 p-4"
              >
                <p className="text-2xl font-black tracking-normal">{item.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-300">
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
              : "Browse the catalog and enroll in a seeded path to start tracking progress.",
            href: focusCourse ? `/courses/${focusCourse.id}` : "/browse",
            cta: "Open path",
          },
          {
            icon: BarChart3,
            label: "Momentum",
            title: `${completedCourses.length} completed, ${coursesInProgress.length} active`,
            body:
              "Progress, completion, and practice history are all part of the demo data story.",
            href: "/quiz",
            cta: "Practice now",
          },
          {
            icon: CreditCard,
            label: "Checkout",
            title: "Fake payment flow ready",
            body:
              "Paid demo courses open a safe checkout screen, approve a fake card, then enroll through the real API.",
            href: "/checkout/course_product_analytics",
            cta: "Test checkout",
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="product-surface group rounded-md p-5 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:hover:border-slate-700"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-700">
                  {item.label}
                </p>
                <h3 className="mt-1 text-lg font-black tracking-normal text-slate-950">
                  {item.title}
                </h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{item.body}</p>
            <span className="mt-5 inline-flex items-center text-sm font-bold text-teal-700 group-hover:text-teal-900">
              {item.cta}
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        ))}
      </section>

      <div className="mt-8 mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black tracking-normal text-slate-950">
            Your courses
          </h3>
          <p className="text-sm text-slate-600">
            Continue a lesson or open a course overview.
          </p>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <Link href="/discussions" className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-slate-950">
            Discussions
            <MessageSquare className="ml-1 h-4 w-4" />
          </Link>
          <Link href="/browse" className="inline-flex items-center text-sm font-bold text-teal-700 hover:text-teal-900">
            Browse all
            <Compass className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
      <CoursesList
        items={allCourses}
      />
      <section className="mt-8 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">
            Supabase upgrade path
          </p>
          <h3 className="mt-2 text-xl font-black tracking-normal text-slate-950 dark:text-white">
            Auth, database, storage, realtime, functions, and vector search are staged.
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            The demo keeps running without paid services, while the integration hub
            documents exactly where Supabase can replace local/demo boundaries.
          </p>
        </div>
        <Link
          href="/integrations"
          className="group rounded-md border border-slate-200 bg-slate-950 p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800"
        >
          <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-200">
            Integration command center
          </p>
          <h3 className="mt-2 text-xl font-black tracking-normal">
            {connectorSummary.ready} ready now, {connectorSummary.needsSetup} staged with env keys.
          </h3>
          <span className="mt-5 inline-flex items-center text-sm font-bold text-cyan-100 group-hover:text-white">
            Review Supabase and provider setup
            <Plug className="ml-2 h-4 w-4" />
          </span>
        </Link>
      </section>
    </div>
  );
}
 
export default DashboardPage;
