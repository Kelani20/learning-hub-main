import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
import {
  getDemoChapters,
  getDemoCourse,
  getDemoProgress,
  getDemoProgressRows,
} from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const course =
    isDemoMode && !hasDatabaseUrl && getDemoCourse(courseId)
      ? null
      : await db.course
          .findUnique({
            where: {
              id: courseId,
            },
            include: {
              chapters: {
                where: {
                  isPublished: true,
                },
                include: {
                  userProgress: {
                    where: {
                      userId,
                    },
                  },
                },
                orderBy: {
                  position: "asc",
                },
              },
            },
          })
          .catch((error) => {
            console.log("[COURSE_LAYOUT]", error);
            return null;
          });

  if (!course && isDemoMode) {
    const demoCourse = getDemoCourse(courseId);

    if (demoCourse) {
      const demoCourseWithChapters = {
        ...demoCourse,
        chapters: getDemoChapters(courseId).map((chapter) => ({
          ...chapter,
          userProgress: getDemoProgressRows(userId, courseId).filter(
            (progress) => progress.chapterId === chapter.id
          ),
        })),
      };
      const demoProgress = getDemoProgress(courseId) ?? 0;

      return (
        <div className="h-full">
          <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
            <CourseNavbar course={demoCourseWithChapters} progressCount={demoProgress} />
          </div>
          <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
            <CourseSidebar course={demoCourseWithChapters} progressCount={demoProgress} />
          </div>
          <main className="md:pl-80 pt-[80px] h-full">{children}</main>
        </div>
      );
    }
  }

  if (!course) {
    return redirect("/sign-in");
  }

  const progressCount = await getProgress(userId, course.id);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
