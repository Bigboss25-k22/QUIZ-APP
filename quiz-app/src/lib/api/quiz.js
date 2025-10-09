import { apiFetch } from "@/lib/apiClient";

export function getTestList() {
    return apiFetch("/test");
}

export function getQuizDetail(id) {
    return apiFetch(`/test/${id}`);
}

// Lấy chi tiết test với questions (sử dụng backend structure)
export function getTestDetails(testId) {
    return apiFetch(`/test/${testId}`);
}

// Submit test theo format backend yêu cầu
export function submitTest(testId, userId, responses) {
    return apiFetch("/test/submit-test", {
        method: "POST",
        body: JSON.stringify({
            testId: testId,
            userId: userId,
            responses: responses
        }),
    });
}

// Lấy tất cả kết quả test
export function getAllTestResults() {
    return apiFetch("/test-results");
}

// Lấy kết quả test theo user
export function getTestResultsByUser(userId) {
    return apiFetch(`/test-results/${userId}`);
}

export function submitQuiz(id, answers) {
    return apiFetch(`/quiz/${id}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
    });
}
