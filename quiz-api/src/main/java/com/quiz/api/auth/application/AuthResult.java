package com.quiz.api.auth.application;

import com.quiz.api.user.domain.User;

public record AuthResult(String accessToken, String refreshToken, User user) {
}
