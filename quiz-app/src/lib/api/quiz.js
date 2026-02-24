import axiosInstance from "../axiosInstance";

export async function getTestList(page = 0, size = 10, category = null, search = null) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const response = await axiosInstance.get(`/api/test?${params.toString()}`);
    return response.data;
}

export async function getQuizDetail(id) {
    const response = await axiosInstance.get(`/api/test/${id}`);
    return response.data;
}

export async function getTestDetails(testId) {
    const response = await axiosInstance.get(`/api/test/${testId}`);
    return response.data;
}

export async function submitTest(testId, userId, responses) {
    const response = await axiosInstance.post("/api/test/submit-test", {
        testId,
        userId,
        responses
    });
    return response.data;
}

export async function getAllTestResults() {
    const response = await axiosInstance.get("/api/test/test-results");
    return response.data;
}

export async function getTestResultsByUser(userId) {
    const response = await axiosInstance.get(`/api/test/test-results/${userId}`);
    return response.data;
}

export async function submitQuiz(id, answers) {
    const response = await axiosInstance.post(`/api/quiz/${id}/submit`, { answers });
    return response.data;
}
