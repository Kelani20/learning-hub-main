import { db } from "@/lib/db";
import { getDemoProgress, isDemoCourseId } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  if (isDemoMode && !hasDatabaseUrl && isDemoCourseId(courseId)) {
    return getDemoProgress(courseId) ?? 0;
  }

  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    if (publishedChapterIds.length === 0) {
      return 0;
    }

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChapterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
