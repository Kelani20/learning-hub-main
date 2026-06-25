import { Category, Chapter, Course } from "@prisma/client";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";
import {
  demoCourses,
  getDemoCategory,
  getDemoChapters,
  getDemoProgress,
} from "@/lib/demo-data";

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

const getDemoDashboardCourses = (): DashboardCourses => {
  const courses = demoCourses
    .map((course) => ({
      ...course,
      category: getDemoCategory(course.categoryId)!,
      chapters: getDemoChapters(course.id),
      progress: getDemoProgress(course.id),
    }))
    // Only courses the demo learner is actually enrolled in (i.e. have
    // progress) belong on the dashboard — the rest live in the catalog.
    .filter((course) => course.progress !== null) as CourseWithProgressWithCategory[];

  return {
    completedCourses: courses.filter((course) => course.progress === 100),
    coursesInProgress: courses.filter((course) => (course.progress ?? 0) < 100),
  };
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  if (isDemoMode && !hasDatabaseUrl) {
    return getDemoDashboardCourses();
  }

  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

    if (courses.length === 0 && isDemoMode) {
      return getDemoDashboardCourses();
    }

    // Resolve progress for all courses in parallel instead of a sequential
    // await-in-loop (avoids an N+1 round-trip on dashboard load).
    await Promise.all(
      courses.map(async (course) => {
        course["progress"] = await getProgress(userId, course.id);
      })
    );

    const completedCourses = courses.filter((course) => course.progress === 100);
    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourses,
      coursesInProgress,
    };

  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES_ERROR]", error);
    if (isDemoMode) {
      return getDemoDashboardCourses();
    }

    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
