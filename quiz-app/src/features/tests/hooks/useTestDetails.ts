import { useQuery } from '@tanstack/react-query';
import { getTestDetails } from '../api';
import { TestDetailResponse } from '../../../types/quiz.type';
import { AppAxiosError } from '../../../types/api.type';

export const useTestDetails = (testId: number | string) => {
    return useQuery<TestDetailResponse, AppAxiosError>({
        queryKey: ['testDetails', testId],
        queryFn: () => getTestDetails(testId),
        enabled: !!testId,
    });
};
