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
    badge: "bg-teal-50 text-teal-800 dark:bg-teal-500/15 dark:text-teal-200",
    accent: "text-teal-700 dark:text-teal-300",
    level: "Applied",
    lab: "Workflow lab",
  },
  Product: {
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200",
    accent: "text-amber-700 dark:text-amber-300",
    level: "Foundations",
    lab: "Decision lab",
  },
  Frontend: {
    badge: "bg-sky-50 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200",
    accent: "text-sky-700 dark:text-sky-300",
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
    badge: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    accent: "text-teal-700 dark:text-teal-300",
    level: "Guided",
    lab: "Practice lab",
  };
  const estimatedMinutes = Math.max(45, chaptersLength * 35);

  return (
    <Link href={`/courses/${id}`} className="block h-full cursor-pointer">
      <article className="product-surface group flex h-full flex-col overflow-hidden rounded-2xl transition duration-200 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-xl dark:hover:border-teal-400/30">
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          <Image
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            alt={title}
            src={imageUrl}
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
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
          <h3 className="line-clamp-2 text-base font-black tracking-tight text-slate-950 transition group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
            {title}
          </h3>
          <div className="my-4 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-x-2 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-950">
              <IconBadge size="sm" icon={BookOpen} />
              <span>{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}</span>
            </div>
            <div className="flex items-center gap-x-2 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-950">
              <Clock3 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span>{estimatedMinutes} min</span>
            </div>
            <div className="col-span-2 flex items-center gap-x-2 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-950">
              <Layers className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span>{meta.level} path with quiz and discussion follow-through</span>
            </div>
          </div>
          {progress !== null ? (
            <div className="mt-auto space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>Progress</span>
                <span className="flex items-center gap-x-1 tabular-nums">
                  {progress === 100 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
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
            <p className="mt-auto inline-flex items-center text-sm font-black text-teal-700 dark:text-teal-300">
              Open preview and enroll in one click
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}
