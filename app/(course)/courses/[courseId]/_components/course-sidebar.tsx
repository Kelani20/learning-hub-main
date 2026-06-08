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
  const { userId } = auth();

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
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">
          {course.title}
        </h1>
        {activePurchase && (
          <div className="mt-10">
            <CourseProgress 
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
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
