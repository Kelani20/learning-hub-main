import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

interface DataCardProps {
  value: number;
  label: string;
  shouldFormat?: boolean;
  helper?: string;
  icon?: LucideIcon;
};

export const DataCard = ({
  value,
  label,
  shouldFormat,
  helper,
  icon: Icon,
}: DataCardProps) => {
  return (
    <Card className="product-surface rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold text-slate-600 dark:text-slate-300">
          {label}
        </CardTitle>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black tabular-nums tracking-tight text-slate-950 dark:text-white">
          {shouldFormat ? formatPrice(value): value}
        </div>
        {helper && (
          <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">
            {helper}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
