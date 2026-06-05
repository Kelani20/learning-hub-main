import { describe, expect, it } from "vitest";

import { generateLocalQuestions } from "@/lib/quiz/local-generator";

describe("generateLocalQuestions", () => {
  it("creates deterministic mcq questions with the answer in the options", () => {
    const questions = generateLocalQuestions("React state", 3, "mcq");

    expect(questions).toHaveLength(3);
    expect(questions[0].options).toContain(questions[0].answer);
    expect(questions[0].question).toContain("React state");
  });

  it("creates open-ended questions without options", () => {
    const questions = generateLocalQuestions("PostgreSQL", 2, "open_ended");

    expect(questions).toHaveLength(2);
    expect(questions[0].options).toBeUndefined();
  });
});
