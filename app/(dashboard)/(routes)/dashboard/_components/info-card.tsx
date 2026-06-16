import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
};

export const InfoCard = ({
  variant,
  icon: Icon,
  label,
  numberOfItems,
}: InfoCardProps) => {
  return (
    <div className="product-surface flex items-center gap-x-4 rounded-2xl p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <IconBadge
        variant={variant}
        icon={Icon}
      />
      <div>
        <p className="font-bold text-slate-950 dark:text-white">
          {label}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  )
};
