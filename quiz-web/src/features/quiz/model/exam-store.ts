import { z } from "zod";
import { createStore } from "zustand/vanilla";
import { createJSONStorage, persist } from "zustand/middleware";
import { answerLabelSchema, type AnswerLabel } from "./schemas";

const persistedExamDraftSchema = z.object({
  activeQuestionIndex: z.number().int().nonnegative(),
  answers: z.record(z.string().regex(/^\d+$/), answerLabelSchema),
  flaggedQuestionIds: z.array(z.number().int().positive()),
  startedAt: z.number().int().positive(),
});

export type PersistedExamDraft = z.infer<typeof persistedExamDraftSchema>;

export type ExamState = PersistedExamDraft & {
  hasHydrated: boolean;
  selectAnswer: (questionId: number, answer: AnswerLabel) => void;
  toggleFlag: (questionId: number) => void;
  goToQuestion: (index: number) => void;
  markHydrated: () => void;
  resetDraft: () => void;
};

export function createExamStore({ quizId, questionIds, userId, now = Date.now() }: { quizId: number; questionIds: number[]; userId: number; now?: number }) {
  const validQuestionIds = new Set(questionIds);
  const lastQuestionIndex = Math.max(0, questionIds.length - 1);
  const initialDraft: PersistedExamDraft = { activeQuestionIndex: 0, answers: {}, flaggedQuestionIds: [], startedAt: now };

  return createStore<ExamState>()(persist((set) => ({
    ...initialDraft,
    hasHydrated: false,
    selectAnswer: (questionId, answer) => set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
    toggleFlag: (questionId) => set((state) => ({ flaggedQuestionIds: state.flaggedQuestionIds.includes(questionId) ? state.flaggedQuestionIds.filter((id) => id !== questionId) : [...state.flaggedQuestionIds, questionId] })),
    goToQuestion: (index) => set({ activeQuestionIndex: Math.min(lastQuestionIndex, Math.max(0, index)) }),
    markHydrated: () => set({ hasHydrated: true }),
    resetDraft: () => set({ ...initialDraft, startedAt: Date.now() }),
  }), {
    name: `quiz-exam-draft:${userId}:${quizId}`,
    version: 1,
    storage: createJSONStorage(() => sessionStorage),
    skipHydration: true,
    partialize: (state) => ({ activeQuestionIndex: state.activeQuestionIndex, answers: state.answers, flaggedQuestionIds: state.flaggedQuestionIds, startedAt: state.startedAt }),
    merge: (persistedState, currentState) => {
      const parsed = persistedExamDraftSchema.safeParse(persistedState);
      if (!parsed.success) return currentState;
      const answers = Object.fromEntries(Object.entries(parsed.data.answers).filter(([questionId]) => validQuestionIds.has(Number(questionId))));
      const flaggedQuestionIds = parsed.data.flaggedQuestionIds.filter((questionId) => validQuestionIds.has(questionId));
      return { ...currentState, ...parsed.data, answers, flaggedQuestionIds, activeQuestionIndex: Math.min(lastQuestionIndex, parsed.data.activeQuestionIndex) };
    },
    onRehydrateStorage: () => (state) => state?.markHydrated(),
  }));
}

export type ExamStore = ReturnType<typeof createExamStore>;
