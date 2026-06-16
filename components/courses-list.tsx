import Link from "next/link";
import { Compass, SearchX } from "lucide-react";
import { Category, Course } from "@prisma/client";

import { CourseCard } from "@/components/course-card";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({
  items
}: CoursesListProps) => {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-300">
            <SearchX className="h-6 w-6" />
          </span>
          <h3 className="mt-4 text-lg font-black tracking-tight text-slate-950 dark:text-white">
            No courses match your filters
          </h3>
          <p className="mt-1 max-w-sm text-pretty text-sm text-slate-600 dark:text-slate-400">
            Try clearing your search or pick a different category to explore the full catalog.
          </p>
          <Link
            href="/browse"
            className="mt-5 inline-flex cursor-pointer items-center gap-x-2 rounded-full bg-teal-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-glow transition hover:-translate-y-0.5 hover:bg-teal-400"
          >
            Browse all courses
            <Compass className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
