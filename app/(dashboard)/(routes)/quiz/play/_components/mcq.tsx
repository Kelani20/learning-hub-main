"use client";

import { z } from "zod";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { Game, Question } from "@prisma/client";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import { differenceInSeconds } from "date-fns";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, formatTimeDelta } from "@/lib/utils";
import MCQCounter from "./mcq-counter";

const checkAnswerSchema = z.object({
  userInput: z.string(),
  questionId: z.string(),
});

const endGameSchema = z.object({
  gameId: z.string(),
});

type MCQQuestion = Pick<Question, "id" | "options" | "question"> &
  Partial<Pick<Question, "answer">>;

const MCQ = ({
  game,
}: {
  game: Game & { questions: MCQQuestion[] };
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [stats, setStats] = useState({
    correct_answers: 0,
    wrong_answers: 0,
  });
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [now, setNow] = useState(new Date());

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    if (Array.isArray(currentQuestion.options)) {
      return currentQuestion.options as string[];
    }

    if (typeof currentQuestion.options === "string") {
      try {
        return JSON.parse(currentQuestion.options) as string[];
      } catch {
        return [currentQuestion.options];
      }
    }

    return [];
  }, [currentQuestion]);

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      if (!currentQuestion) {
        throw new Error("No active question");
      }

      if (game.id.startsWith("demo-")) {
        const userInput = options[selectedChoice] ?? "";
        const isCorrect =
          currentQuestion.answer?.toLowerCase().trim() ===
          userInput.toLowerCase().trim();

        return { isCorrect };
      }

      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
      };
      const response = await axios.post(`/api/quiz/checkAnswer`, payload);
      return response.data;
    },
  });

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      if (game.id.startsWith("demo-")) {
        return "Game ended";
      }

      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      const response = await axios.post(`/api/quiz/endGame`, payload);
      return response.data;
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          setStats((stats) => ({
            ...stats,
            correct_answers: stats.correct_answers + 1,
          }));
          toast.success("You got it right!");
        } else {
          setStats((stats) => ({
            ...stats,
            wrong_answers: stats.wrong_answers + 1,
          }));
          toast.error("You got it wrong!");
        }
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setQuestionIndex((questionIndex) => questionIndex + 1);
      },
    });
  }, [checkAnswer, questionIndex, game.questions.length, endGame]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === "1") {
        setSelectedChoice(0);
      } else if (key === "2") {
        setSelectedChoice(1);
      } else if (key === "3") {
        setSelectedChoice(2);
      } else if (key === "4") {
        setSelectedChoice(3);
      } else if (key === "Enter") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  if (hasEnded) {
    return (
      <div className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 motion-rise">
        <div className="whitespace-nowrap rounded-full bg-teal-600 px-5 py-2.5 font-semibold text-white shadow-glow">
          Completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/quiz/statistics/${game.id}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-3 cursor-pointer rounded-full")}
        >
          View statistics
          <BarChart className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col">
          {/* topic */}
          <p className="flex items-center gap-x-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Topic</span>
            <span className="rounded-full bg-teal-600 px-3 py-1 text-sm font-medium text-white">
              {game.topic}
            </span>
          </p>
          <div className="mt-3 flex items-center self-start text-slate-500 dark:text-slate-400">
            <Timer className="mr-2 h-5 w-5" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <MCQCounter
          correct_answers={stats.correct_answers}
          wrong_answers={stats.wrong_answers}
        />
      </div>
      <Card className="mt-4 w-full rounded-2xl border-slate-200 product-surface dark:border-slate-800">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 divide-y divide-slate-300 text-center dark:divide-slate-700">
            <div className="text-slate-900 dark:text-slate-100">{questionIndex + 1}</div>
            <div className="text-base text-slate-400 dark:text-slate-500">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg text-slate-700 dark:text-slate-300">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-4 flex w-full flex-col items-center justify-center">
        {options.map((option, index) => {
          return (
            <Button
              key={option}
              variant={selectedChoice === index ? "default" : "outline"}
              className="mb-3 w-full cursor-pointer justify-start rounded-xl py-8 transition duration-200"
              onClick={() => setSelectedChoice(index)}
            >
              <div className="flex items-center justify-start">
                <div className="mr-5 rounded-md border px-3 py-2">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })}
        <Button
          variant="default"
          className="mt-2 cursor-pointer rounded-full"
          size="lg"
          disabled={isChecking || hasEnded}
          onClick={() => {
            handleNext();
          }}
        >
          {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
