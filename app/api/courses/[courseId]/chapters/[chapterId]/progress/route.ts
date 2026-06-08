import { auth } from "@/lib/auth";

import { db } from "@/lib/db";
import { isDemoCourseId } from "@/lib/demo-data";
import { hasDatabaseUrl, isDemoMode } from "@/lib/env";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const { courseId, chapterId } = await params;
  let isCompleted = false;

  try {
    const { userId } = auth();
    const body = await req.json();
    isCompleted = !!body.isCompleted;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (isDemoMode && !hasDatabaseUrl && isDemoCourseId(courseId)) {
      return NextResponse.json({
        id: `progress_${userId}_${courseId}_${chapterId}`,
        userId,
        chapterId,
        isCompleted,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const chapter = await db.chapter.findFirst({
      where: {
        id: chapterId,
        courseId,
        isPublished: true,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!chapter.isFree && !purchase) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const userProgress = await db.userProgress.upsert({
      where: { 
        userId_chapterId: { 
          userId, 
          chapterId
        } 
      },
      update: { 
        isCompleted 
      },
      create: { 
        userId, 
        chapterId,
        isCompleted 
      },
    });
    
    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    if (isDemoMode && isDemoCourseId(courseId)) {
      const { userId } = auth();

      return NextResponse.json({
        id: `progress_${userId}_${courseId}_${chapterId}`,
        userId,
        chapterId,
        isCompleted,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return new NextResponse("Internal Error", { status: 500 })
  }
}
