package com.quizserver.services.user;

import com.quizserver.dto.UserDTO;
import com.quizserver.entities.User;

public interface UserService {

    Boolean hasUserWithEmail(String email);

    User createUser(User user);

    User login(User user);

    User getUserByEmail(String email);

    User updateUserProfile(String email, UserDTO userDTO);
}
