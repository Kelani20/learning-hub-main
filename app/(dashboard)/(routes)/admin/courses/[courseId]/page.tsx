import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";

import { db } from "@/lib/db";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { CategoryForm } from "./_components/category-form";
import { ImageForm } from "./_components/image-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapers-form";
import Actions from "./_components/actions";

const CourseIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string }>
}) => {
  const { courseId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/dashboard");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionTest = `${completedFields}/${totalFields} fields completed.`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          label="This course is not published yet. It will not be visible to students until you publish it."
        />
      )}
      <div className="min-h-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
        <div className="product-surface motion-rise flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-y-2">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
              Course setup
            </p>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              Customize and publish your course
            </h1>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Complete all fields. {completionTest}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                Customize your course
              </h2>
            </div>
            <TitleForm
              initialData={course}
              courseId={course.id}
            />
            <DescriptionForm
              initialData={course}
              courseId={course.id}
            />
            <ImageForm
              initialData={course}
              courseId={course.id}
            />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                  Course Chapters
                </h2>
              </div>
              <div>
                <ChaptersForm
                  initialData={course}
                  courseId={course.id}
                />
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                Sell your course
              </h2>
            </div>
            <PriceForm 
              initialData={course}
              courseId={course.id}
            />
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                  Resources & Attachments
                </h2>
              </div>
              <AttachmentForm
                initialData={course}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default CourseIdPage;
