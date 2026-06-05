"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuizMeCard = () => {
  const router = useRouter();
  return (
    <Card
      className="border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:cursor-pointer hover:border-teal-300 hover:shadow-lg"
      onClick={() => {
        router.push("/quiz/create");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-black tracking-normal text-slate-950">
          Quiz me!
        </CardTitle>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-teal-800">
          <BrainCircuit size={24} strokeWidth={2.5} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600">
          Challenge yourself to a quiz with a topic of your choice.
        </p>
      </CardContent>
    </Card>
  );
};

export default QuizMeCard;
