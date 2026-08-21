package com.quiz.api.auth.infrastructure.persistence;

import com.quiz.api.auth.application.port.out.RefreshTokenRepositoryPort;
import com.quiz.api.auth.domain.RefreshToken;
import com.quiz.api.auth.infrastructure.persistence.entity.RefreshTokenEntity;
import com.quiz.api.user.infrastructure.persistence.entity.UserEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RefreshTokenPersistenceAdapter implements RefreshTokenRepositoryPort {
    private final SpringDataRefreshTokenRepository repository;
    private final EntityManager entityManager;

    @Override
    public RefreshToken save(RefreshToken token) { return toDomain(repository.save(toEntity(token))); }

    @Override
    public Optional<RefreshToken> findByTokenHash(String tokenHash) { return repository.findByTokenHash(tokenHash).map(this::toDomain); }

    @Override
    public Optional<RefreshToken> findByUserId(Long userId) { return repository.findByUserId(userId).map(this::toDomain); }

    @Override
    public void deleteByTokenHash(String tokenHash) { repository.deleteByTokenHash(tokenHash); }

    private RefreshToken toDomain(RefreshTokenEntity entity) {
        return new RefreshToken(entity.getId(), entity.getTokenHash(), entity.getUser().getId(), entity.getExpiryDate(), entity.getCreatedAt());
    }

    private RefreshTokenEntity toEntity(RefreshToken token) {
        RefreshTokenEntity entity = new RefreshTokenEntity();
        entity.setId(token.getId());
        entity.setTokenHash(token.getTokenHash());
        entity.setUser(entityManager.getReference(UserEntity.class, token.getUserId()));
        entity.setExpiryDate(token.getExpiryDate());
        entity.setCreatedAt(token.getCreatedAt());
        return entity;
    }
}
