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
    <div className="min-h-full bg-slate-50">
      <div className="px-4 pt-4 md:hidden md:mb-0 block">
        <Suspense fallback={<div className="h-10 rounded-full bg-slate-100" />}>
          <SearchInput />
        </Suspense>
      </div>
      <div className="space-y-5 p-4 sm:p-6">
        <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
                Course catalog
              </p>
              <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-normal text-slate-950">
                Browse practical learning paths with lessons, quizzes, and community context.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Every seeded path is designed for a click-through demo: open the course,
                watch a chapter, track progress, practice the topic, and join the discussion.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[520px]">
              {[
                { icon: BookOpenCheck, label: "Courses", value: courses.length },
                { icon: PlayCircle, label: "Video", value: "URL" },
                { icon: ClipboardCheck, label: "Practice", value: "Local" },
                { icon: MessageSquare, label: "Threads", value: "DB" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-slate-200 bg-slate-50 p-3"
                >
                  <item.icon className="h-4 w-4 text-teal-700" />
                  <p className="mt-2 text-lg font-black tracking-normal text-slate-950">
                    {item.value}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Suspense fallback={<div className="h-10 rounded-full bg-slate-100" />}>
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
