import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";
import {
  filterDemoCourses,
  getDemoCategory,
  getDemoChapters,
  getDemoProgress,
} from "@/lib/demo-data";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

const getDemoCourseCards = ({
  title,
  categoryId,
}: {
  title?: string;
  categoryId?: string;
}): CourseWithProgressWithCategory[] => {
  return filterDemoCourses({ title, categoryId }).map((course) => ({
    ...course,
    category: getDemoCategory(course.categoryId),
    chapters: getDemoChapters(course.id).map((chapter) => ({ id: chapter.id })),
    progress: getDemoProgress(course.id),
  }));
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  if (isDemoMode && !hasDatabaseUrl) {
    return getDemoCourseCards({ title, categoryId });
  }

  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (courses.length === 0 && isDemoMode) {
      return getDemoCourseCards({ title, categoryId });
    }

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }

          const progressPercentage = await getProgress(userId, course.id);

          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    if (isDemoMode) {
      return getDemoCourseCards({ title, categoryId });
    }

    return [];
  }
};
