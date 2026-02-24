package com.quizserver.services.auth;

import com.quizserver.dto.AuthResponse;
import com.quizserver.dto.LoginRequest;
import com.quizserver.dto.SignupRequest;
import com.quizserver.dto.TokenResponse;

public interface AuthService {

    /**
     * Register a new user
     * 
     * @param request Signup request with email, password, and name
     * @return AuthResponse with access token, refresh token, and user info
     */
    AuthResponse signup(SignupRequest request);

    /**
     * Authenticate user and generate tokens
     * 
     * @param request Login request with email and password
     * @return AuthResponse with access token, refresh token, and user info
     */
    AuthResponse login(LoginRequest request);

    /**
     * Refresh access token using refresh token
     * 
     * @param refreshToken The refresh token string
     * @return TokenResponse with new access token and refresh token
     */
    TokenResponse refreshToken(String refreshToken);

    /**
     * Logout user by invalidating refresh token
     * 
     * @param refreshToken The refresh token to invalidate
     */
    void logout(String refreshToken);
}
