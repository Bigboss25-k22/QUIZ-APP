package com.quiz.api.auth.application;

public record TokenPair(String accessToken, String refreshToken) {
}
