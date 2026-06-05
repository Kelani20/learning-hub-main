import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

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
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

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
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
            Course catalog
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
            Browse practical learning paths.
          </h2>
        </div>
        <Suspense fallback={<div className="h-10 rounded-full bg-slate-100" />}>
          <Categories
            items={categories}
          />
        </Suspense>
        <CoursesList items={courses} />
      </div>
    </div>
   );
}
 
export default BrowsePage;
