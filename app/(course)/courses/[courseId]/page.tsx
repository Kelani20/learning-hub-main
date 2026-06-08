import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getDemoChapters, getDemoCourse } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

const CourseIdPage = async ({
  params 
}: {
  params: Promise<{
    courseId: string 
  }>
}) => {
  const { courseId } = await params;
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
                orderBy: {
                  position: "asc",
                },
              },
            },
          })
          .catch((error) => {
            console.log("[COURSE_ID_PAGE]", error);
            return null;
          });

  if (!course && isDemoMode) {
    const demoCourse = getDemoCourse(courseId);
    const firstDemoChapter = getDemoChapters(courseId)[0];

    if (demoCourse && firstDemoChapter) {
      return redirect(`/courses/${demoCourse.id}/chapters/${firstDemoChapter.id}`);
    }
  }

  if (!course) {
    return redirect("/sign-in");
  }

  const firstChapter = course.chapters[0];

  if (!firstChapter) {
    return redirect("/browse");
  }

  return redirect(`/courses/${course.id}/chapters/${firstChapter.id}`);
};

export default CourseIdPage;
