import React, { useState, useEffect } from "react";
import { BrainCircuit } from "lucide-react";

import { Progress } from "@/components/ui/progress";

const loadingTexts = [
  "Generating your questions...",
  "Sharpening every prompt for you...",
  "Tailoring the quiz to your topic...",
  "Lining up the right level of challenge...",
  "Almost ready, building your quiz...",
];

const LoadingQuestions = ({
  finished 
}: { 
  finished: boolean 
}) => {
  const [progress, setProgress] = useState(10);
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      let randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setLoadingText(loadingTexts[randomIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (finished) return 100;
        if (prev === 100) {
          return 0;
        }
        if (Math.random() < 0.1) {
          return prev + 2;
        }
        return prev + 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [finished]);

  return (
    <div className="absolute left-1/2 top-1/2 flex w-[88vw] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col items-center">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm product-surface motion-rise dark:border-slate-800">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
            <BrainCircuit className="h-7 w-7 animate-pulse" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
            {loadingText}
          </h1>
        </div>

        <Progress value={progress} className="mt-6 w-full" />

        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((row) => (
            <div key={row} className="space-y-2">
              <div className="skeleton h-4 w-1/3 rounded-md" />
              <div className="skeleton h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingQuestions;