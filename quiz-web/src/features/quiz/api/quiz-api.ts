import { apiClient } from "@/lib/http/client";
import { parseApiResponse } from "@/lib/http/api-contract";
import { quizDetailSchema, quizPageSchema, quizResultSchema, quizResultsSchema, submitQuizRequestSchema, type AnswerSelection } from "../model/schemas";

export const quizApi = {
  list: async (search = "") => parseApiResponse(quizPageSchema, (await apiClient.get<unknown>("/api/test", { params: { page: 0, size: 100, search: search || undefined } })).data, "/api/test"),
  detail: async (id: string) => parseApiResponse(quizDetailSchema, (await apiClient.get<unknown>(`/api/test/${id}`)).data, `/api/test/${id}`),
  submit: async (testId: number, userId: number, responses: AnswerSelection[]) => {
    const payload = submitQuizRequestSchema.parse({ testId, userId, responses });
    return parseApiResponse(quizResultSchema, (await apiClient.post<unknown>("/api/test/submit-test", payload)).data, "/api/test/submit-test");
  },
  results: async (userId: number) => parseApiResponse(quizResultsSchema, (await apiClient.get<unknown>(`/api/test/test-results/${userId}`)).data, `/api/test/test-results/${userId}`),
};
