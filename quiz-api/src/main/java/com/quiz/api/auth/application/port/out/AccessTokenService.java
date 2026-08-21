package com.quiz.api.auth.application.port.out;

import com.quiz.api.user.domain.User;

import java.time.Instant;
import java.util.Optional;

public interface AccessTokenService {
    String issueFor(User user, Instant sessionStartedAt);
    Optional<AccessTokenClaims> parse(String token);
}
