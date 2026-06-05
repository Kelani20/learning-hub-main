import { db } from "@/lib/db";

export async function enrollInCourse(userId: string, courseId: string) {
  const course = await db.course.findFirst({
    where: {
      id: courseId,
      isPublished: true,
    },
  });

  if (!course) {
    return {
      ok: false as const,
      status: 404,
      message: "Course not found",
    };
  }

  const purchase = await db.purchase.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {},
    create: {
      userId,
      courseId,
    },
  });

  return {
    ok: true as const,
    purchase,
  };
}
