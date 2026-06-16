"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuizMeCard = () => {
  const router = useRouter();
  return (
    <Card
      className="cursor-pointer rounded-2xl border-slate-200 bg-white shadow-sm transition duration-200 product-surface hover:-translate-y-1 hover:border-teal-400 hover:shadow-lg dark:border-slate-800"
      onClick={() => {
        router.push("/quiz/create");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-black tracking-normal text-slate-950 dark:text-slate-50">
          Quiz me
        </CardTitle>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
          <BrainCircuit size={24} strokeWidth={2.5} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          Generate a fresh quiz on any topic you choose and start practicing instantly.
        </p>
      </CardContent>
    </Card>
  );
};

export default QuizMeCard;
