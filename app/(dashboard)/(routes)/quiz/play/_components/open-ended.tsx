"use client";

import { z } from "zod";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import { differenceInSeconds } from "date-fns";
import { Game, Question } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";


import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatTimeDelta } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import OpenEndedPercentage from "../_components/open-ended-percentage";
import BlankAnswerInput from "../_components/blank-answer-input";

const checkAnswerSchema = z.object({
  userInput: z.string(),
  questionId: z.string(),
});

const endGameSchema = z.object({
  gameId: z.string(),
});

function localSimilarityPercentage(expected: string, actual: string) {
  const normalizedExpected = expected.toLowerCase().trim();
  const normalizedActual = actual.toLowerCase().trim();

  if (!normalizedActual) return 0;
  if (normalizedExpected === normalizedActual) return 100;

  const expectedTokens = new Set(normalizedExpected.split(/\s+/));
  const actualTokens = new Set(normalizedActual.split(/\s+/));
  const overlap = Array.from(expectedTokens).filter((token) =>
    actualTokens.has(token)
  );

  return Math.round((overlap.length / Math.max(expectedTokens.size, 1)) * 100);
}

const OpenEnded = ({ 
  game 
}: {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
}) => {
  const [hasEnded, setHasEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [blankAnswer, setBlankAnswer] = useState("");
  const [averagePercentage, setAveragePercentage] = useState(0);

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

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


  const [now, setNow] = useState(new Date());
  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      // Rebuild the full answer by dropping each blank input back into the
      // template, so multi-blank questions score against the whole answer
      // (previously only the last blank was ever submitted).
      const blank = "_____";
      const parts = blankAnswer.split(blank);
      const inputs = Array.from(
        document.querySelectorAll<HTMLInputElement>("#user-blank-input")
      );
      let filledAnswer = "";
      parts.forEach((part, index) => {
        filledAnswer += part;
        const input = inputs[index];
        if (input) {
          filledAnswer += input.value;
          input.value = "";
        }
      });

      if (game.id.startsWith("demo-")) {
        return {
          percentageSimilar: localSimilarityPercentage(
            currentQuestion.answer,
            filledAnswer
          ),
        };
      }

      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: filledAnswer,
      };
      const response = await axios.post(`/api/quiz/checkAnswer`, payload);
      return response.data;
    },
  });

  useEffect(() => {
    if (!hasEnded) {
      const interval = setInterval(() => {
        setNow(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasEnded]);

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast(`Your answer is ${percentageSimilar}% similar to the correct answer`);
        // Running mean: prev is the average over the `questionIndex` answers
        // already scored, so weight it before folding in this answer.
        setAveragePercentage((prev) => {
          return (prev * questionIndex + percentageSimilar) / (questionIndex + 1);
        });

        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setQuestionIndex((prev) => prev + 1);
      },
      onError: (error) => {
        console.error(error);
        toast.error("Something went wrong");
      },
    });
  }, [checkAnswer, questionIndex, endGame, game.questions.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === "Enter") {
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
        <OpenEndedPercentage percentage={averagePercentage} />
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
        <BlankAnswerInput
          setBlankAnswer={setBlankAnswer}
          answer={currentQuestion.answer}
        />
        <Button
          variant="outline"
          className="mt-4 cursor-pointer rounded-full"
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

export default OpenEnded;
