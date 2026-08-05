import { beforeEach, describe, expect, it } from "vitest";
import { createExamStore } from "./exam-store";

describe("exam store", () => {
  beforeEach(() => sessionStorage.clear());

  it("quản lý câu trả lời, đánh dấu và điều hướng có giới hạn", () => {
    const store = createExamStore({ quizId: 10, userId: 20, questionIds: [1, 2], now: 1_000 });
    store.getState().selectAnswer(1, "B");
    store.getState().toggleFlag(2);
    store.getState().goToQuestion(99);
    expect(store.getState()).toMatchObject({ activeQuestionIndex: 1, answers: { 1: "B" }, flaggedQuestionIds: [2], startedAt: 1_000 });
  });

  it("hydrate draft hợp lệ và loại dữ liệu của câu hỏi cũ", async () => {
    sessionStorage.setItem("quiz-exam-draft:20:10", JSON.stringify({ version: 1, state: { activeQuestionIndex: 9, answers: { 1: "A", 999: "B" }, flaggedQuestionIds: [1, 999], startedAt: 500 } }));
    const store = createExamStore({ quizId: 10, userId: 20, questionIds: [1, 2], now: 1_000 });
    await store.persist.rehydrate();
    expect(store.getState()).toMatchObject({ activeQuestionIndex: 1, answers: { 1: "A" }, flaggedQuestionIds: [1], startedAt: 500, hasHydrated: true });
  });

  it("bỏ draft hỏng và cô lập storage theo user/quiz", async () => {
    sessionStorage.setItem("quiz-exam-draft:20:10", JSON.stringify({ version: 1, state: { answers: "invalid" } }));
    const store = createExamStore({ quizId: 10, userId: 20, questionIds: [1], now: 1_000 });
    const anotherStore = createExamStore({ quizId: 10, userId: 21, questionIds: [1], now: 2_000 });
    await store.persist.rehydrate();
    await anotherStore.persist.rehydrate();
    expect(store.getState().answers).toEqual({});
    expect(store.getState().startedAt).toBe(1_000);
    expect(anotherStore.getState().startedAt).toBe(2_000);
  });
});
