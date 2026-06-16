import React from "react";
import { Award, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResultsCard = ({ 
  accuracy 
}: {
  accuracy: number;
}) => {
  return (
    <Card className="rounded-2xl border-slate-200 product-surface dark:border-slate-800 md:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-semibold text-slate-600 dark:text-slate-400">
          Results
        </CardTitle>
        <Award className="h-5 w-5 text-teal-600 dark:text-teal-400" />
      </CardHeader>
      <CardContent className="flex h-3/5 flex-col items-center justify-center gap-y-2">
        {accuracy > 75 ? (
          <>
            <Trophy className="text-yellow-500" size={50} />
            <div className="flex flex-col items-center text-2xl font-semibold text-yellow-500">
              <span>Impressive!</span>
              <span className="text-center text-sm text-slate-500 dark:text-slate-400">
                {"> 75% accuracy"}
              </span>
            </div>
          </>
        ) : accuracy > 25 ? (
          <>
            <Trophy className="text-slate-400" size={50} />
            <div className="flex flex-col items-center text-2xl font-semibold text-slate-400">
              <span>Good job!</span>
              <span className="text-center text-sm text-slate-500 dark:text-slate-400">
                {"> 25% accuracy"}
              </span>
            </div>
          </>
        ) : (
          <>
            <Trophy className="text-amber-700" size={50} />
            <div className="flex flex-col items-center text-2xl font-semibold text-amber-700 dark:text-amber-600">
              <span>Nice try!</span>
              <span className="text-center text-sm text-slate-500 dark:text-slate-400">
                {"< 25% accuracy"}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsCard;