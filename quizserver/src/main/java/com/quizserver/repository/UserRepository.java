package com.quizserver.repository;

import com.quizserver.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.quizserver.entities.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Additional query methods can be defined here if needed
    // For example, you might want to find a user by email:
    // Optional<User> findByEmail(String email);

    // Or find users by role:
    // List<User> findByRole(UserRole role);

    User findByRole(UserRole role);

    User findFirstByEmail(String email);

    Optional<User> findByEmail(String email);
}
