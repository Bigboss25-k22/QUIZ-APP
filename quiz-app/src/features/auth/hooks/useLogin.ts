import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api';
import { useAuth } from '@/app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { AuthResponse } from '../../../types/user.type';
import { AppAxiosError } from '../../../types/api.type';

export const useLogin = () => {
    const { login } = useAuth() as any; // Type context later
    const navigate = useNavigate();

    return useMutation<AuthResponse, AppAxiosError, Record<string, string>>({
        mutationFn: loginUser,
        onSuccess: (data) => {
            login(data);
            navigate('/');
        },
    });
};
