package com.quiz.api.user.application.port.out;

import com.quiz.api.user.domain.User;
import com.quiz.api.user.domain.UserRole;

import java.util.Optional;

public interface UserRepositoryPort {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    Optional<User> findByRole(UserRole role);
    boolean existsByEmail(String email);
    User save(User user);
}
