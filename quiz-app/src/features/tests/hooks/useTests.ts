import { useQuery } from '@tanstack/react-query';
import { getTestList } from '../api';
import { PaginatedResponse, TestDTO } from '../../../types/quiz.type';
import { AppAxiosError } from '../../../types/api.type';

export const useTests = ({ page = 0, size = 10, category = null, search = null }: any) => {
    return useQuery<PaginatedResponse<TestDTO>, AppAxiosError>({
        queryKey: ['tests', page, size, category, search],
        queryFn: () => getTestList(page, size, category, search),
    });
};
