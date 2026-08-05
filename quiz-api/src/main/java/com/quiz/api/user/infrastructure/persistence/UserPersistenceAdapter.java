package com.quiz.api.user.infrastructure.persistence;

import com.quiz.api.user.application.port.out.UserRepositoryPort;
import com.quiz.api.user.domain.User;
import com.quiz.api.user.domain.UserRole;
import com.quiz.api.user.infrastructure.persistence.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserPersistenceAdapter implements UserRepositoryPort {
    private final SpringDataUserRepository repository;

    @Override
    public Optional<User> findById(Long id) { return repository.findById(id).map(this::toDomain); }

    @Override
    public Optional<User> findByEmail(String email) { return repository.findByEmail(email).map(this::toDomain); }

    @Override
    public Optional<User> findByRole(UserRole role) { return repository.findFirstByRole(role).map(this::toDomain); }

    @Override
    public boolean existsByEmail(String email) { return repository.existsByEmail(email); }

    @Override
    public User save(User user) { return toDomain(repository.save(toEntity(user))); }

    private User toDomain(UserEntity entity) {
        return new User(entity.getId(), entity.getEmail(), entity.getPassword(), entity.getName(), entity.getRole());
    }

    private UserEntity toEntity(User user) {
        UserEntity entity = new UserEntity();
        entity.setId(user.getId());
        entity.setEmail(user.getEmail());
        entity.setPassword(user.getPassword());
        entity.setName(user.getName());
        entity.setRole(user.getRole());
        return entity;
    }
}
