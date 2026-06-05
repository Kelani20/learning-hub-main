import { GeneratedQuestion, QuizType } from "@/lib/quiz/schema";

const stems = [
  "What is the most important principle when learning {topic}?",
  "Which habit improves long-term retention for {topic}?",
  "What should you do when a {topic} explanation feels unclear?",
  "Which review technique works best for practicing {topic}?",
];

const answers = [
  "Practice with feedback",
  "Review and explain it",
  "Check assumptions",
  "Use examples",
];

const distractors = [
  "Memorize without context",
  "Avoid testing yourself",
  "Skip review",
  "Use only one source",
];

export function generateLocalQuestions(
  topic: string,
  amount: number,
  type: QuizType
): GeneratedQuestion[] {
  return Array.from({ length: amount }, (_, index) => {
    const question = stems[index % stems.length].replaceAll("{topic}", topic);
    const answer = answers[index % answers.length];

    if (type === "open_ended") {
      return { question, answer };
    }

    return {
      question,
      answer,
      options: [
        answer,
        distractors[index % distractors.length],
        distractors[(index + 1) % distractors.length],
        distractors[(index + 2) % distractors.length],
      ],
    };
  });
}
