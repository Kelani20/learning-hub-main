"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Question } from "@prisma/client";

const QuestionsList = ({ 
  questions 
}: {
  questions: Question[];
}) => {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 product-surface dark:border-slate-800">
      <Table>
        <TableCaption className="pb-4 text-slate-500 dark:text-slate-400">
          That is every question from this quiz.
        </TableCaption>
        <TableHeader>
          <TableRow className="border-slate-200 dark:border-slate-800">
            <TableHead className="w-[10px] text-slate-600 dark:text-slate-400">No.</TableHead>
            <TableHead className="text-slate-600 dark:text-slate-400">
              Question &amp; correct answer
            </TableHead>
            <TableHead className="text-slate-600 dark:text-slate-400">Your answer</TableHead>
            {questions[0].questionType === "open_ended" && (
              <TableHead className="w-[10px] text-right text-slate-600 dark:text-slate-400">
                Accuracy
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          <>
            {questions.map(
              (
                { answer, question, userAnswers, percentageCorrect, isCorrect },
                index
              ) => {
                return (
                  <TableRow
                    key={index}
                    className="border-slate-200 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50"
                  >
                    <TableCell className="font-medium tabular-nums text-slate-500 dark:text-slate-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">
                      {question} <br />
                      <br />
                      <span className="font-semibold text-teal-600 dark:text-teal-400">
                        {answer}
                      </span>
                    </TableCell>
                    {questions[0].questionType === "open_ended" ? (
                      <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                        {userAnswers}
                      </TableCell>
                    ) : (
                      <TableCell
                        className={`${
                          isCorrect
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        } font-semibold`}
                      >
                        {userAnswers}
                      </TableCell>
                    )}

                    {percentageCorrect && (
                      <TableCell className="text-right tabular-nums text-slate-700 dark:text-slate-300">
                        {percentageCorrect}
                      </TableCell>
                    )}
                  </TableRow>
                );
              }
            )}
          </>
        </TableBody>
      </Table>
    </div>
  );
};

export default QuestionsList;