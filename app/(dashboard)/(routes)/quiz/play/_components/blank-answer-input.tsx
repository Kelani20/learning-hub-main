import React, { Dispatch, SetStateAction, useMemo } from "react";
import keyword_extractor from "keyword-extractor";

const blank = "_____";

const BlankAnswerInput = ({
  answer, setBlankAnswer 
}: {
  answer: string;
  setBlankAnswer: Dispatch<SetStateAction<string>>;
}) => {
  const keywords = useMemo(() => {
    const words = keyword_extractor.extract(answer, {
      language: "english",
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, [answer]);

  const answerWithBlanks = useMemo(() => {
    const answerWithBlanks = keywords.reduce((acc, curr) => {
      return acc.replaceAll(curr, blank);
    }, answer);
    setBlankAnswer(answerWithBlanks);
    return answerWithBlanks;
  }, [answer, keywords, setBlankAnswer]);

  return (
    <div className="mt-4 flex w-full justify-start">
      <h1 className="text-xl font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
        {/* replace the blanks with input elements */}
        {answerWithBlanks.split(blank).map((part, index) => {
          return (
            <React.Fragment key={index}>
              {part}
              {index === answerWithBlanks.split(blank).length - 1 ? (
                ""
              ) : (
                <input
                  id="user-blank-input"
                  className="w-28 border-b-2 border-slate-300 bg-transparent text-center text-teal-600 transition-colors focus:border-teal-500 focus:outline-none dark:border-slate-600 dark:text-teal-400 dark:focus:border-teal-400"
                  type="text"
                />
              )}
            </React.Fragment>
          );
        })}
      </h1>
    </div>
  );
};

export default BlankAnswerInput;
