import axiosInstance from "../../../lib/axiosInstance";
import { PaginatedResponse, TestDTO, TestDetailResponse, TestResult, QuestionResponseInput } from "../../../types/quiz.type";

export async function getTestList(page: number = 0, size: number = 10, category: string | null = null, search: string | null = null): Promise<PaginatedResponse<TestDTO>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const response = await axiosInstance.get<PaginatedResponse<TestDTO>>(`/api/test?${params.toString()}`);
    return response.data;
}

export async function getQuizDetail(id: number | string): Promise<TestDetailResponse> {
    const response = await axiosInstance.get<TestDetailResponse>(`/api/test/${id}`);
    return response.data;
}

export async function getTestDetails(testId: number | string): Promise<TestDetailResponse> {
    const response = await axiosInstance.get<TestDetailResponse>(`/api/test/${testId}`);
    return response.data;
}

export async function submitTest(testId: number, userId: number, responses: QuestionResponseInput[]): Promise<TestResult> {
    const response = await axiosInstance.post<TestResult>("/api/test/submit-test", {
        testId,
        userId,
        responses
    });
    return response.data;
}

export async function getAllTestResults(): Promise<TestResult[]> {
    const response = await axiosInstance.get<TestResult[]>("/api/test/test-results");
    return response.data;
}

export async function getTestResultsByUser(userId: number | string): Promise<TestResult[]> {
    const response = await axiosInstance.get<TestResult[]>(`/api/test/test-results/${userId}`);
    return response.data;
}

export async function submitQuiz(id: number | string, answers: any): Promise<any> {
    const response = await axiosInstance.post(`/api/quiz/${id}/submit`, { answers });
    return response.data;
}
