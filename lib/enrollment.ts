import { db } from "@/lib/db";
import { isDemoCourseId, makeDemoPurchase } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

export async function enrollInCourse(userId: string, courseId: string) {
  if (isDemoMode && !hasDatabaseUrl && isDemoCourseId(courseId)) {
    return {
      ok: true as const,
      purchase: makeDemoPurchase(userId, courseId),
    };
  }

  try {
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      if (isDemoMode && isDemoCourseId(courseId)) {
        return {
          ok: true as const,
          purchase: makeDemoPurchase(userId, courseId),
        };
      }

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
  } catch (error) {
    console.log("[ENROLLMENT]", error);

    if (isDemoMode && isDemoCourseId(courseId)) {
      return {
        ok: true as const,
        purchase: makeDemoPurchase(userId, courseId),
      };
    }

    return {
      ok: false as const,
      status: 500,
      message: "Enrollment is temporarily unavailable",
    };
  }
}
