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
    <div className="flex items-center gap-x-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <IconBadge
        variant={variant}
        icon={Icon}
      />
      <div>
        <p className="font-bold text-slate-950">
          {label}
        </p>
        <p className="text-sm text-slate-600">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  )
};
