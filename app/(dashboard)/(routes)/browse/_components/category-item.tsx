"use client";

import qs from "query-string";
import { LucideIcon } from "lucide-react";
import { 
  usePathname, 
  useRouter, 
  useSearchParams
} from "next/navigation";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: LucideIcon;
};

export const CategoryItem = ({
  label,
  value,
  icon: Icon,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        title: currentTitle,
        categoryId: isSelected ? null : value,
      }
    }, { skipNull: true, skipEmptyString: true });

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-x-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-500 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-white",
        isSelected &&
          "border-teal-500 bg-teal-500 text-white shadow-glow hover:border-teal-500 hover:text-white dark:border-teal-400 dark:bg-teal-500 dark:text-white dark:hover:text-white"
      )}
      type="button"
    >
      {Icon && <Icon className="h-4 w-4" />}
      <div className="truncate">
        {label}
      </div>
    </button>
  )
}
