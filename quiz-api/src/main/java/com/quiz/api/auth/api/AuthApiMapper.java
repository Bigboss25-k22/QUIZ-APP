package com.quiz.api.auth.api;

import com.quiz.api.auth.api.dto.AuthResponse;
import com.quiz.api.auth.api.dto.TokenResponse;
import com.quiz.api.auth.application.AuthResult;
import com.quiz.api.auth.application.TokenPair;
import com.quiz.api.user.api.UserApiMapper;

final class AuthApiMapper {
    private AuthApiMapper() { }

    static AuthResponse toResponse(AuthResult result) {
        return new AuthResponse(result.accessToken(), result.refreshToken(), UserApiMapper.toDto(result.user()));
    }

    static TokenResponse toResponse(TokenPair pair) {
        return new TokenResponse(pair.accessToken(), pair.refreshToken());
    }
}
