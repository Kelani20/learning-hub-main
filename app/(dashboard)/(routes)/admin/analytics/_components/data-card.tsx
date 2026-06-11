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
    <Card className="rounded-md border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold text-slate-600">
          {label}
        </CardTitle>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-white">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black tracking-normal text-slate-950">
          {shouldFormat ? formatPrice(value): value}
        </div>
        {helper && (
          <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-slate-500">
            {helper}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
