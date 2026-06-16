import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BookOpenCheck, ClipboardCheck, MessageSquare, PlayCircle } from "lucide-react";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { demoCategories } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

import { Categories } from "./_components/categories";

interface BrowsePageProps {
  searchParams: Promise<{
    title: string;
    categoryId: string;
  }>
};

const BrowsePage = async ({
  searchParams
}: BrowsePageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const categories =
    isDemoMode && !hasDatabaseUrl
      ? demoCategories
      : await db.category
          .findMany({
            orderBy: {
              name: "asc"
            }
          })
          .catch((error) => {
            console.log("[BROWSE_CATEGORIES]", error);
            return isDemoMode ? demoCategories : [];
          });

  const categoryItems =
    categories.length === 0 && isDemoMode ? demoCategories : categories;

  const resolvedSearchParams = await searchParams;

  const courses = await getCourses({
    userId,
    ...resolvedSearchParams,
  });

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <div className="px-4 pt-4 md:hidden md:mb-0 block">
        <Suspense fallback={<div className="skeleton h-10 rounded-full" />}>
          <SearchInput />
        </Suspense>
      </div>
      <div className="space-y-5 p-4 sm:p-6">
        <section className="product-surface motion-rise rounded-2xl p-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-600 dark:text-teal-300">
                Course catalog
              </p>
              <h2 className="mt-2 max-w-3xl text-balance text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                Browse practical learning paths with lessons, quizzes, and community context.
              </h2>
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-600 dark:text-slate-400">
                Every path is built to take you the full distance: open the course,
                watch a chapter, track progress, practice the topic, and join the discussion.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[520px]">
              {[
                { icon: BookOpenCheck, label: "Courses", value: courses.length },
                { icon: PlayCircle, label: "Video", value: "HD" },
                { icon: ClipboardCheck, label: "Practice", value: "Adaptive" },
                { icon: MessageSquare, label: "Threads", value: "Live" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-teal-500/40 dark:border-slate-800 dark:bg-slate-900"
                >
                  <item.icon className="h-4 w-4 text-teal-600 dark:text-teal-300" />
                  <p className="mt-2 text-lg font-black tracking-tight text-slate-950 dark:text-white">
                    {item.value}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Suspense fallback={<div className="skeleton h-10 rounded-full" />}>
          <Categories
            items={categoryItems}
          />
        </Suspense>
        <CoursesList items={courses} />
      </div>
    </div>
   );
}
 
export default BrowsePage;
