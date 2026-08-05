package com.quiz.api.auth.application.port.out;

import com.quiz.api.user.domain.User;

import java.util.Optional;

public interface AccessTokenService {
    String issueFor(User user);
    Optional<String> subjectOf(String token);
    boolean isValidFor(String token, String subject);
}
