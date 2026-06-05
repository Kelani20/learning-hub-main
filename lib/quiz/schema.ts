import { z } from "zod";

export const quizTypeSchema = z.enum(["mcq", "open_ended"]);

export const quizCreationSchema = z.object({
  topic: z.string().min(4).max(80),
  type: quizTypeSchema,
  amount: z.coerce.number().int().min(1).max(10),
});

export const generatedQuestionSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  options: z.array(z.string()).min(3).max(4).optional(),
});

export type QuizType = z.infer<typeof quizTypeSchema>;
export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
