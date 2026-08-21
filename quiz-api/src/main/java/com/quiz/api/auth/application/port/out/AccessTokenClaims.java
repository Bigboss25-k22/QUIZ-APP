package com.quiz.api.auth.application.port.out;

import java.time.Instant;

public record AccessTokenClaims(Long userId, Instant sessionStartedAt) {
}
