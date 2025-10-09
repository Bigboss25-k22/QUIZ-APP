package com.quizserver.services.user;

import com.quizserver.entities.User;
import com.quizserver.enums.UserRole;
import com.quizserver.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    // Implement methods from UserService interface here
    // For example, you might have methods like createUser, getUserById, updateUser, deleteUser, etc.

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    private void createAdminUser() {
        User optinalUser = userRepository.findByRole(UserRole.ADMIN);

        if (optinalUser == null) {
            User adminUser = new User();

            adminUser.setName("Admin");
            adminUser.setEmail("admin@gmail.com");
            adminUser.setPassword("admin");
            adminUser.setRole(UserRole.ADMIN);

            userRepository.save(adminUser);
        }
    }

    public Boolean hasUserWithEmail(String email) {
        return userRepository.findFirstByEmail(email) != null;
    }

    public User createUser(User user) {
        user.setRole(UserRole.USER);

        return userRepository.save(user);
    }

    public User login(User user){
        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());

        if (optionalUser.isPresent() && user.getPassword().equals(optionalUser.get().getPassword())) {
            return optionalUser.get();
        } else {
            return null; // or throw an exception if you prefer
        }
    }
}
