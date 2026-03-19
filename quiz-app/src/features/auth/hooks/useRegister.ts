import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { AppAxiosError } from '../../../types/api.type';

export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation<{ message: string }, AppAxiosError, Record<string, string>>({
        mutationFn: registerUser,
        onSuccess: () => {
            navigate('/login');
        },
    });
};
