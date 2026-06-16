import { auth } from "@/lib/auth";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import { isDemoCourseId, makeDemoPurchase } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

interface CoureSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CoureSidebarProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const purchase =
    isDemoMode && !hasDatabaseUrl && isDemoCourseId(course.id)
      ? makeDemoPurchase(userId, course.id)
      : await db.purchase
          .findUnique({
            where: {
              userId_courseId: {
                userId,
                courseId: course.id,
              },
            },
          })
          .catch((error) => {
            console.log("[COURSE_SIDEBAR_PURCHASE]", error);
            return isDemoMode && isDemoCourseId(course.id)
              ? makeDemoPurchase(userId, course.id)
              : null;
          });

  const activePurchase =
    purchase ?? (isDemoMode && isDemoCourseId(course.id)
      ? makeDemoPurchase(userId, course.id)
      : null);

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex flex-col gap-y-1 border-b border-slate-200 p-8 dark:border-slate-800">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
          Course
        </p>
        <h1 className="text-balance text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50">
          {course.title}
        </h1>
        {activePurchase && (
          <div className="mt-8">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex w-full flex-col py-2">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !activePurchase}
          />
        ))}
      </div>
    </div>
  );
};
