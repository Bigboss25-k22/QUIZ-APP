"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quizApi } from "../api/quiz-api";
import type { AnswerSelection } from "./types";
import { quizKeys, quizQueries } from "./quiz-queries";

export const useQuizzes = (search = "") => useQuery(quizQueries.list(search));
export const useQuiz = (id: string) => useQuery(quizQueries.detail(id));
export const useResults = (userId?: number) => useQuery(quizQueries.results(userId));

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...quizKeys.all, "submit"],
    mutationFn: ({ testId, userId, responses }: { testId: number; userId: number; responses: AnswerSelection[] }) => quizApi.submit(testId, userId, responses),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: quizKeys.results() }),
  });
}
