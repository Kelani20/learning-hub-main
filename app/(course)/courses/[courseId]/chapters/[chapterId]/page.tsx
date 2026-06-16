import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { toEmbeddableVideoUrl } from "@/lib/video";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import CourseProgressButton from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string }>
}) => {
  const { courseId, chapterId } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    return redirect("/");
  } 

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId,
    courseId,
  });

  if (!chapter || !course) {
    return redirect("/")
  }


  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div className="animate-fade-in">
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="Nice work — you've completed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="Enroll in this course to unlock the full chapter."
        />
      )}
      <div className="mx-auto flex max-w-4xl flex-col px-4 pb-24 pt-6 md:px-6">
        <VideoPlayer
          chapterId={chapterId}
          title={chapter.title}
          courseId={courseId}
          nextChapterId={nextChapter?.id}
          playbackId={muxData?.playbackId}
          videoUrl={toEmbeddableVideoUrl(chapter.videoUrl)}
          isLocked={isLocked}
          completeOnEnd={completeOnEnd}
        />
        <div className="mt-6">
          <div className="flex flex-col items-start justify-between gap-y-4 md:flex-row md:items-center md:gap-x-6">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {chapter.title}
            </h2>
            <div className="w-full shrink-0 md:w-auto">
              {purchase ? (
                <CourseProgressButton
                  chapterId={chapterId}
                  courseId={courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              ) : (
                <CourseEnrollButton
                  courseId={courseId}
                  price={course.price!}
                />
              )}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator className="my-6" />
              <div className="flex flex-col gap-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Resources
                </h3>
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="group flex w-full cursor-pointer items-center gap-x-3 rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-500/40 dark:hover:text-brand-300"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400">
                      <FileText className="h-4 w-4" />
                    </span>
                    <p className="line-clamp-1">
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
   );
}
 
export default ChapterIdPage;
