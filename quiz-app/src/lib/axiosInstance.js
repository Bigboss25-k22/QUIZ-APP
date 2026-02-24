import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8082',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable sending cookies for refresh token
});

// Store for access token and auth context functions
let accessToken = null;
let authContextFunctions = null;

// Function to set access token
export const setAccessToken = (token) => {
    accessToken = token;
};

// Function to get access token
export const getAccessToken = () => {
    return accessToken;
};

// Function to set auth context functions (login, logout, updateToken)
export const setAuthContext = (functions) => {
    authContextFunctions = functions;
};

// Request interceptor: Add JWT token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle errors and automatic token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh token endpoint
                const refreshToken = localStorage.getItem('quiz_refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(
                    'http://localhost:8082/api/auth/refresh',
                    { refreshToken },
                    { withCredentials: true }
                );

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

                // Update tokens
                setAccessToken(newAccessToken);
                localStorage.setItem('quiz_refresh_token', newRefreshToken);

                // Update token in auth context if available
                if (authContextFunctions?.updateToken) {
                    authContextFunctions.updateToken(newAccessToken);
                }

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed - logout user
                if (authContextFunctions?.logout) {
                    authContextFunctions.logout();
                }
                // Redirect to login page
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other HTTP errors
        const status = error.response?.status;
        const message = error.response?.data?.message || 'An error occurred';

        switch (status) {
            case 403:
                console.error('Permission denied:', message);
                // You can show a notification here
                break;
            case 404:
                console.error('Resource not found:', message);
                break;
            case 500:
                console.error('Server error:', message);
                break;
            default:
                console.error('Error:', message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
