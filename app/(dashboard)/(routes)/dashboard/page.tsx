import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Compass, MessageSquare } from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { Button } from "@/components/ui/button";
import { InfoCard } from "./_components/info-card";

const DashboardPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const {
    completedCourses,
    coursesInProgress,
  } = await getDashboardCourses(userId);

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
              Learner workspace
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
              Keep learning without account setup.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              This demo session includes seeded enrollments, progress tracking, quizzes,
              and discussion data so the app is immediately explorable.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/browse">
              <Button className="h-11 rounded-full bg-slate-950 px-5 font-bold text-white hover:bg-slate-800">
                Browse courses
                <Compass className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/discussions">
              <Button variant="outline" className="h-11 rounded-full border-slate-300 bg-white px-5 font-bold">
                Discussions
                <MessageSquare className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
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
      <div className="mt-8 mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black tracking-normal text-slate-950">
            Your courses
          </h3>
          <p className="text-sm text-slate-600">
            Continue a lesson or open a course overview.
          </p>
        </div>
        <Link href="/browse" className="hidden items-center text-sm font-bold text-teal-700 hover:text-teal-900 sm:flex">
          Browse all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <CoursesList
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  );
}
 
export default DashboardPage;
