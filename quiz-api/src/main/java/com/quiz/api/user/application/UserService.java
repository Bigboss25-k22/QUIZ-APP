package com.quiz.api.user.application;

import com.quiz.api.shared.security.PasswordHasher;
import com.quiz.api.shared.exception.BadRequestException;
import com.quiz.api.shared.exception.ResourceNotFoundException;
import com.quiz.api.user.application.port.out.UserRepositoryPort;
import com.quiz.api.user.domain.User;
import com.quiz.api.user.domain.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepositoryPort users;
    private final PasswordHasher passwordHasher;

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        return users.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional(readOnly = true)
    public User getById(Long id) {
        return users.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public User register(String email, String plainPassword, String name) {
        if (users.existsByEmail(email)) {
            throw new BadRequestException("User with this email already exists");
        }
        return users.save(new User(null, email, passwordHasher.hash(plainPassword), name, UserRole.USER));
    }

    @Transactional
    public User updateProfile(String currentEmail, String nextEmail, String nextName) {
        User user = getByEmail(currentEmail);
        if (nextEmail != null && !nextEmail.equals(currentEmail) && users.existsByEmail(nextEmail)) {
            throw new BadRequestException("Email is already taken");
        }
        if (nextEmail != null && !nextEmail.isBlank()) {
            user.setEmail(nextEmail);
        }
        if (nextName != null && !nextName.isBlank()) {
            user.setName(nextName);
        }
        return users.save(user);
    }

    @Transactional
    public void ensureDefaultAdmin() {
        if (users.findByRole(UserRole.ADMIN).isEmpty()) {
            users.save(new User(null, "admin@gmail.com", passwordHasher.hash("admin"), "Admin", UserRole.ADMIN));
        }
    }
}
