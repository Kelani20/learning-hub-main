import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle2 } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/course-progress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
};

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`} className="block h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
          <Image
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            alt={title}
            src={imageUrl}
          />
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur">
            {category}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-base font-black tracking-normal text-slate-950 transition group-hover:text-teal-800">
            {title}
          </h3>
          <div className="my-4 flex items-center gap-x-2 text-sm">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <div className="mt-auto space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Progress</span>
                <span className="flex items-center gap-x-1">
                  {progress === 100 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                  {progress}%
                </span>
              </div>
              <CourseProgress
                variant={progress === 100 ? "success" : "default"}
                size="sm"
                value={progress}
              />
            </div>
          ) : (
            <p className="mt-auto text-sm font-black text-slate-950">
              {price === 0 ? "Free" : formatPrice(price)}
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}
