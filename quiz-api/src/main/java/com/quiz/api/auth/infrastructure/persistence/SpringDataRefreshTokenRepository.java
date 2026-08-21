package com.quiz.api.auth.infrastructure.persistence;

import com.quiz.api.auth.infrastructure.persistence.entity.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

interface SpringDataRefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {
    Optional<RefreshTokenEntity> findByTokenHash(String tokenHash);
    Optional<RefreshTokenEntity> findByUserId(Long userId);
    void deleteByTokenHash(String tokenHash);
}
