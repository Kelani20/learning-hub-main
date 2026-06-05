import { auth } from "@/lib/auth";
import { NextResponse } from "next/server"

import { db } from "@/lib/db";
import { deleteMuxAsset } from "@/lib/video";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
  ) => {
  try {
    const { userId } = auth();
    const { courseId } = await params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.update({
      where: {
         id: courseId,
         userId, 
        },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);

  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
  ) => {
  try {
    const { courseId } = await params;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
         id: courseId,
         userId,
        },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 })
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await deleteMuxAsset(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
      }
    });

    return NextResponse.json(deletedCourse);

  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
