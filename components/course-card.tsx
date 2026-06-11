import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock3, Layers } from "lucide-react";

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

const categoryMeta: Record<
  string,
  {
    badge: string;
    accent: string;
    level: string;
    lab: string;
  }
> = {
  AI: {
    badge: "bg-cyan-50 text-cyan-800",
    accent: "text-cyan-700",
    level: "Applied",
    lab: "Workflow lab",
  },
  Product: {
    badge: "bg-amber-50 text-amber-800",
    accent: "text-amber-700",
    level: "Foundations",
    lab: "Decision lab",
  },
  Frontend: {
    badge: "bg-rose-50 text-rose-800",
    accent: "text-rose-700",
    level: "Systems",
    lab: "Build lab",
  },
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
  const meta = categoryMeta[category] ?? {
    badge: "bg-slate-100 text-slate-800",
    accent: "text-teal-700",
    level: "Guided",
    lab: "Practice lab",
  };
  const estimatedMinutes = Math.max(45, chaptersLength * 35);

  return (
    <Link href={`/courses/${id}`} className="block h-full">
      <article className="product-surface group flex h-full flex-col overflow-hidden rounded-md transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:hover:border-slate-700">
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
          <Image
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            alt={title}
            src={imageUrl}
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          <div className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm backdrop-blur ${meta.badge}`}>
            {category}
          </div>
          <div className="absolute bottom-3 right-3 rounded-full bg-slate-950/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur">
            {price === 0 ? "Free access" : formatPrice(price)}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className={`text-xs font-black uppercase tracking-[0.14em] ${meta.accent}`}>
            {meta.lab}
          </p>
          <h3 className="line-clamp-2 text-base font-black tracking-normal text-slate-950 transition group-hover:text-teal-800">
            {title}
          </h3>
          <div className="my-4 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-x-2 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-950">
              <IconBadge size="sm" icon={BookOpen} />
              <span>{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}</span>
            </div>
            <div className="flex items-center gap-x-2 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-950">
              <Clock3 className="h-4 w-4 text-slate-500" />
              <span>{estimatedMinutes} min</span>
            </div>
            <div className="col-span-2 flex items-center gap-x-2 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-950">
              <Layers className="h-4 w-4 text-slate-500" />
              <span>{meta.level} path with quiz and discussion follow-through</span>
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
              Open preview and enroll in one click
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}
