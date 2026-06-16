import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/lib/db";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import ChapterActions from "./_components/chapter-actions";

const ChapterId = async ({
  params,
}: {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}) => {
  const { courseId, chapterId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-up");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
    },
  });

  if(!chapter) {
    return redirect(`/admin/courses/${courseId}`);
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFields})`;
  const isComplete  = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner 
          variant="warning"
          label={"This chapter is not published. It will not be visible to students."}
        />
      )}
      <div className="min-h-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/admin/courses/${courseId}`}
              className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors duration-200 mb-6 dark:text-slate-300 dark:hover:text-brand-400"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="product-surface motion-rise flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-y-2">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
                  Chapter setup
                </p>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  Build out this chapter
                </h1>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                  Customize Chapter
                </h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                  Access Settings
                </h2>
              </div>
              <ChapterAccessForm 
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">
                Add a Video
              </h2>
            </div>
            <ChapterVideoForm 
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>
      </div>
    </>
  );
}
 
export default ChapterId;
