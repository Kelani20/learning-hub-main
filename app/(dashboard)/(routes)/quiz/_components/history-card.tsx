"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HistoryCard = () => {
  const router = useRouter();
  return (
    <Card
      className="cursor-pointer rounded-2xl border-slate-200 bg-white shadow-sm transition duration-200 product-surface hover:-translate-y-1 hover:border-teal-400 hover:shadow-lg dark:border-slate-800"
      onClick={() => {
        router.push("/quiz/history");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-black tracking-normal text-slate-950 dark:text-slate-50">
          History
        </CardTitle>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <History size={24} strokeWidth={2.5} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          Revisit every quiz you have taken and jump back into your results.
        </p>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
