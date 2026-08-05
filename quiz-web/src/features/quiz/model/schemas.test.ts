import { describe, expect, it } from "vitest";
import { quizDetailSchema, quizPageSchema, quizResultSchema } from "./schemas";

describe("quiz schemas", () => {
  it("parse page response theo đúng field backend", () => {
    const result = quizPageSchema.parse({ content: [], currentPage: 0, pageSize: 20, totalElements: 0, totalPages: 0, last: true });
    expect(result.currentPage).toBe(0);
    expect(result.last).toBe(true);
  });

  it("không đưa correctOption xuống model phía UI", () => {
    const result = quizDetailSchema.parse({ testDTO: { id: 1, title: "Java", description: "Mô tả", category: null, time: 30 }, questions: [{ id: 2, questionText: "Câu hỏi", optionA: "A", optionB: "B", optionC: "C", optionD: "D", correctOption: "A" }] });
    expect(result.questions[0]).not.toHaveProperty("correctOption");
    expect(result.testDTO.category).toBeUndefined();
  });

  it("parse result bằng testName/userName thay vì field không tồn tại", () => {
    expect(quizResultSchema.parse({ id: 1, totalQuestions: 10, correctAnswers: 8, percentage: 80, testName: "Java", userName: "An" })).toMatchObject({ testName: "Java", userName: "An" });
    expect(quizResultSchema.safeParse({ id: 1, testId: 2, totalQuestions: 10, correctAnswers: 8, percentage: 80 }).success).toBe(false);
  });
});
