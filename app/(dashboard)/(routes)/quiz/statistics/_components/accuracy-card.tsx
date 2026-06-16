import React from "react";
import { Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AccuracyCard = ({ 
  accuracy 
}:  { 
  accuracy: number 
}) => {
  accuracy = Math.round(accuracy * 100) / 100;
  
  return (
    <Card className="rounded-2xl border-slate-200 product-surface dark:border-slate-800 md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-slate-600 dark:text-slate-400">
          Average accuracy
        </CardTitle>
        <Target className="h-5 w-5 text-teal-600 dark:text-teal-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tabular-nums text-slate-950 dark:text-slate-50">
          {accuracy.toString() + "%"}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccuracyCard;