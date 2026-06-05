"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const WordCloud = ({
  formattedTopics,
}: {
  formattedTopics: { text: string; value: number }[];
}) => {
  const router = useRouter();
  const maxValue = Math.max(...formattedTopics.map((topic) => topic.value), 1);
  const accents = [
    "border-teal-200 bg-teal-50 text-teal-950 hover:border-teal-400",
    "border-amber-200 bg-amber-50 text-amber-950 hover:border-amber-400",
    "border-rose-200 bg-rose-50 text-rose-950 hover:border-rose-400",
    "border-sky-200 bg-sky-50 text-sky-950 hover:border-sky-400",
    "border-lime-200 bg-lime-50 text-lime-950 hover:border-lime-400",
  ];

  return (
    <div className="flex min-h-[260px] flex-wrap content-center items-center justify-center gap-3 rounded-md border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#ecfeff_100%)] p-5">
      {formattedTopics.length === 0 ? (
        <div className="flex items-center gap-x-2 text-sm text-slate-500">
          <Sparkles className="h-4 w-4" />
          Start a quiz to build the topic map.
        </div>
      ) : (
        formattedTopics.map((topic, index) => {
          const weight = topic.value / maxValue;
          const size =
            weight > 0.75
              ? "text-2xl"
              : weight > 0.45
              ? "text-xl"
              : weight > 0.2
              ? "text-base"
              : "text-sm";

          return (
            <button
              key={topic.text}
              type="button"
              onClick={() => router.push(`/quiz?topic=${encodeURIComponent(topic.text)}`)}
              className={cn(
                "rounded-full border px-4 py-2 font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2",
                size,
                accents[index % accents.length]
              )}
            >
              {topic.text}
            </button>
          );
        })
      )}
    </div>
  );
};

export default WordCloud;
