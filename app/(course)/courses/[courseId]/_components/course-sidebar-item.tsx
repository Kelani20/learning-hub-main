"use client";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "group flex w-full cursor-pointer items-stretch gap-x-2 text-left text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100",
        isActive &&
          "bg-brand-50 text-brand-700 hover:bg-brand-50 hover:text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/10 dark:hover:text-brand-300",
        isCompleted && "text-emerald-700 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-400",
        isCompleted && isActive && "bg-emerald-500/10"
      )}
    >
      <div className="flex items-center gap-x-2.5 py-3.5 pl-6 pr-3">
        <Icon
          size={20}
          className={cn(
            "shrink-0 text-slate-400 transition-colors dark:text-slate-500",
            isActive && "text-brand-600 dark:text-brand-400",
            isCompleted && "text-emerald-600 dark:text-emerald-400"
          )}
        />
        <span className="line-clamp-2">{label}</span>
      </div>
      <div
        className={cn(
          "ml-auto h-full w-1 rounded-l-full bg-brand-500 opacity-0 transition-all duration-200",
          isActive && "opacity-100",
          isCompleted && "bg-emerald-500"
        )}
      />
    </button>
  );
};
