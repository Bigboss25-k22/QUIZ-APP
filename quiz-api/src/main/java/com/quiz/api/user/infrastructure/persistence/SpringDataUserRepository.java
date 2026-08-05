package com.quiz.api.user.infrastructure.persistence;

import com.quiz.api.user.domain.UserRole;
import com.quiz.api.user.infrastructure.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

interface SpringDataUserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findFirstByRole(UserRole role);
    boolean existsByEmail(String email);
}
