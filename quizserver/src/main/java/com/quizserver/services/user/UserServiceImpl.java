package com.quizserver.services.user;

import com.quizserver.dto.UserDTO;
import com.quizserver.entities.User;
import com.quizserver.enums.UserRole;
import com.quizserver.exception.BadRequestException;
import com.quizserver.exception.ResourceNotFoundException;
import com.quizserver.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    private void createAdminUser() {
        User optinalUser = userRepository.findByRole(UserRole.ADMIN);

        if (optinalUser == null) {
            User adminUser = new User();

            adminUser.setName("Admin");
            adminUser.setEmail("admin@gmail.com");
            adminUser.setPassword(passwordEncoder.encode("admin"));
            adminUser.setRole(UserRole.ADMIN);

            userRepository.save(adminUser);
        }
    }

    public Boolean hasUserWithEmail(String email) {
        return userRepository.findFirstByEmail(email) != null;
    }

    public User createUser(User user) {
        user.setRole(UserRole.USER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User login(User user) {
        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());

        if (optionalUser.isPresent() && passwordEncoder.matches(user.getPassword(), optionalUser.get().getPassword())) {
            return optionalUser.get();
        } else {
            return null;
        }
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    @Transactional
    public User updateUserProfile(String email, UserDTO userDTO) {
        User user = getUserByEmail(email);

        // Check if new email is already taken by another user
        if (userDTO.getEmail() != null && !userDTO.getEmail().equals(email)) {
            if (hasUserWithEmail(userDTO.getEmail())) {
                throw new BadRequestException("Email is already taken");
            }
            user.setEmail(userDTO.getEmail());
        }

        // Update name if provided
        if (userDTO.getName() != null && !userDTO.getName().trim().isEmpty()) {
            user.setName(userDTO.getName());
        }

        return userRepository.save(user);
    }
}
