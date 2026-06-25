import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { createMuxAsset, deleteMuxAsset } from "@/lib/video";

// Whitelist the columns a client may edit so an arbitrary request body cannot
// mass-assign other Chapter fields (e.g. position, courseId, isPublished).
const chapterUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  isFree: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const parsed = chapterUpdateSchema.safeParse(await req.json().catch(() => null));

    if (!parsed.success) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    const values = parsed.data;

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      if (existingMuxData) {
        await deleteMuxAsset(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await createMuxAsset(values.videoUrl);

      if (asset) {
        await db.muxData.create({
          data: {
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id,
            chapterId,
          },
        });
      }
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("COURSE CHAPTER ID ERROR: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      if (existingMuxData) {
        await deleteMuxAsset(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("COURSE CHAPTER ID DELETE ERROR: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
