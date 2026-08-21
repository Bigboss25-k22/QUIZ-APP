package com.quiz.api.auth.application.port.out;

import com.quiz.api.auth.domain.RefreshToken;

import java.util.Optional;

public interface RefreshTokenRepositoryPort {
    RefreshToken save(RefreshToken token);
    Optional<RefreshToken> findByTokenHash(String tokenHash);
    Optional<RefreshToken> findByUserId(Long userId);
    void deleteByTokenHash(String tokenHash);
}
