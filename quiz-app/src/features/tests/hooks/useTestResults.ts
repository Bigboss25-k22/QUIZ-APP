import { useQuery } from '@tanstack/react-query';
import { getTestResultsByUser } from '../api';
import { TestResult } from '../../../types/quiz.type';
import { AppAxiosError } from '../../../types/api.type';

export const useTestResultsByUser = (userId: number | string) => {
    return useQuery<TestResult[], AppAxiosError>({
        queryKey: ['testResults', userId],
        queryFn: () => getTestResultsByUser(userId),
        enabled: !!userId,
    });
};
