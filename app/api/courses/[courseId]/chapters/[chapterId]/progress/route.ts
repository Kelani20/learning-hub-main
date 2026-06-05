import { auth } from "@/lib/auth";

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string, chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findFirst({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
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
          courseId: params.courseId,
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
          chapterId: params.chapterId 
        } 
      },
      update: { 
        isCompleted 
      },
      create: { 
        userId, 
        chapterId: params.chapterId, 
        isCompleted 
      },
    });
    
    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 })
  }
}
