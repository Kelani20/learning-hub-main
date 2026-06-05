import { redirect } from "next/navigation";

import { db } from "@/lib/db";

const CourseIdPage = async ({
  params 
}: {
  params: Promise<{
    courseId: string 
  }>
}) => {
  const { courseId } = await params;
  const course = await db.course.findUnique({
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
  });

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
