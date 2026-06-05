"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HistoryCard = () => {
  const router = useRouter();
  return (
    <Card
      className="border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:cursor-pointer hover:border-amber-300 hover:shadow-lg"
      onClick={() => {
        router.push("/quiz/history");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-black tracking-normal text-slate-950">
          History
        </CardTitle>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-amber-50 text-amber-700">
          <History size={24} strokeWidth={2.5} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600">
          View past quiz attempts.
        </p>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
