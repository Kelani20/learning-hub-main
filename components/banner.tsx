import { AlertTriangle, CheckCircleIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "border items-center gap-x-2 p-4 text-sm font-semibold flex w-full rounded-xl",
  {
    variants: {
      variant: {
        warning:
          "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-200",
        success:
          "bg-emerald-600 border-emerald-700 text-white dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-200",
      }
    },
    defaultVariants: {
      variant: "warning",
    }
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
};

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

export const Banner = ({
  label,
  variant,
}: BannerProps) => {
  const Icon = iconMap[variant || "warning"];
  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </div>
  )
}