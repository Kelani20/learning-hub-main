import { CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

import { Card } from "@/components/ui/card";

const MCQCounter = ({ 
  correct_answers, 
  wrong_answers 
}: {
  correct_answers: number;
  wrong_answers: number;
}) => {
  return (
    <Card className="flex flex-row items-center justify-center gap-x-1 rounded-2xl border-slate-200 px-3 py-2 product-surface dark:border-slate-800">
      <CheckCircle2 size={26} className="text-emerald-600 dark:text-emerald-400" />
      <span className="mx-2 text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
        {correct_answers}
      </span>

      <Separator orientation="vertical" className="h-7 w-px bg-slate-200 dark:bg-slate-700" />

      <span className="mx-2 text-2xl font-bold tabular-nums text-rose-600 dark:text-rose-400">
        {wrong_answers}
      </span>
      <XCircle size={26} className="text-rose-600 dark:text-rose-400" />
    </Card>
  );
};

export default MCQCounter;