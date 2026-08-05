import { queryOptions, skipToken } from "@tanstack/react-query";
import { quizApi } from "../api/quiz-api";

export const quizKeys = {
  all: ["quiz"] as const,
  lists: () => [...quizKeys.all, "list"] as const,
  list: (search: string) => [...quizKeys.lists(), { search }] as const,
  details: () => [...quizKeys.all, "detail"] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
  results: () => [...quizKeys.all, "results"] as const,
  resultsByUser: (userId?: number) => [...quizKeys.results(), userId] as const,
};

export const quizQueries = {
  list: (search = "") => queryOptions({
    queryKey: quizKeys.list(search),
    queryFn: () => quizApi.list(search),
    staleTime: 5 * 60_000,
  }),
  detail: (id: string) => queryOptions({
    queryKey: quizKeys.detail(id),
    queryFn: id ? () => quizApi.detail(id) : skipToken,
    staleTime: 5 * 60_000,
  }),
  results: (userId?: number) => queryOptions({
    queryKey: quizKeys.resultsByUser(userId),
    queryFn: userId ? () => quizApi.results(userId) : skipToken,
    staleTime: 30_000,
  }),
};
