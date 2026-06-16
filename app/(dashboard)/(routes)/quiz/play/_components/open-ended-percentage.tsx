import { Percent, Target } from "lucide-react";

import { Card } from "@/components/ui/card";

const OpenEndedPercentage = ({ 
  percentage
}: {
  percentage: number;
}) => {
  return (
    <Card className="flex flex-row items-center gap-x-1 rounded-2xl border-slate-200 px-3 py-2 product-surface dark:border-slate-800">
      <Target size={26} className="text-teal-600 dark:text-teal-400" />
      <span className="ml-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
        {percentage}
      </span>
      <Percent size={20} className="text-slate-500 dark:text-slate-400" />
    </Card>
  );
};

export default OpenEndedPercentage;