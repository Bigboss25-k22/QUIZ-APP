import { useMutation } from '@tanstack/react-query';
import { submitTest } from '../api';
import { TestResult, SubmitTestPayload } from '../../../types/quiz.type';
import { AppAxiosError } from '../../../types/api.type';

export const useSubmitTest = () => {
    return useMutation<TestResult, AppAxiosError, SubmitTestPayload>({
        mutationFn: ({ testId, userId, responses }) => submitTest(testId, userId, responses),
    });
};
