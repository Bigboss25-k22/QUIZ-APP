package com.quizserver.services.user;

import com.quizserver.entities.User;

public interface UserService {

    Boolean hasUserWithEmail(String email);

    User createUser(User user);

    User login(User user);
}
