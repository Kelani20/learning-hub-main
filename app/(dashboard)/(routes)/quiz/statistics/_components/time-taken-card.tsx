import React from "react";
import { Hourglass } from "lucide-react";
import { differenceInSeconds } from "date-fns";

import { formatTimeDelta } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TimeTakenCard = ({ 
  timeEnded, 
  timeStarted 
}: {
  timeEnded: Date;
  timeStarted: Date;
}) => {
  return (
    <Card className="rounded-2xl border-slate-200 product-surface dark:border-slate-800 md:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-slate-600 dark:text-slate-400">
          Time taken
        </CardTitle>
        <Hourglass className="h-5 w-5 text-teal-600 dark:text-teal-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tabular-nums text-slate-950 dark:text-slate-50">
          {formatTimeDelta(differenceInSeconds(timeEnded, timeStarted))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTakenCard;