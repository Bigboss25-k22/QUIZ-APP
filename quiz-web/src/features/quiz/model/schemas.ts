import { z } from "zod";

export const answerLabelSchema = z.enum(["A", "B", "C", "D"]);

export const quizSummarySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string(),
  category: z.string().nullable().optional().transform((value) => value ?? undefined),
  time: z.number().int().nonnegative(),
});

export const questionSchema = z.object({
  id: z.number().int().positive(),
  questionText: z.string().min(1),
  optionA: z.string(),
  optionB: z.string(),
  optionC: z.string(),
  optionD: z.string(),
});

export const quizDetailSchema = z.object({
  testDTO: quizSummarySchema,
  questions: z.array(questionSchema),
});

export const quizPageSchema = z.object({
  content: z.array(quizSummarySchema),
  currentPage: z.number().int().nonnegative(),
  pageSize: z.number().int().nonnegative(),
  totalElements: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  last: z.boolean(),
});

export const answerSelectionSchema = z.object({
  questionId: z.number().int().positive(),
  selectedOption: answerLabelSchema,
});

export const submitQuizRequestSchema = z.object({
  testId: z.number().int().positive(),
  userId: z.number().int().positive(),
  responses: z.array(answerSelectionSchema),
});

export const quizResultSchema = z.object({
  id: z.number().int().positive(),
  totalQuestions: z.number().int().nonnegative(),
  correctAnswers: z.number().int().nonnegative(),
  percentage: z.number().min(0).max(100),
  testName: z.string().min(1),
  userName: z.string().min(1),
});

export const quizResultsSchema = z.array(quizResultSchema);

export type AnswerLabel = z.infer<typeof answerLabelSchema>;
export type AnswerSelection = z.infer<typeof answerSelectionSchema>;
export type QuizSummary = z.infer<typeof quizSummarySchema>;
export type Question = z.infer<typeof questionSchema>;
export type QuizDetail = z.infer<typeof quizDetailSchema>;
export type QuizPage = z.infer<typeof quizPageSchema>;
export type QuizResult = z.infer<typeof quizResultSchema>;
export type SubmitQuizRequest = z.infer<typeof submitQuizRequestSchema>;
