package com.quizserver.controller;

import com.quizserver.dto.UserDTO;
import com.quizserver.entities.User;
import com.quizserver.services.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quizserver.exception.BadRequestException;
import com.quizserver.exception.UnauthorizedException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow all origins for CORS
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        if (userService.hasUserWithEmail(user.getEmail())) {
            throw new BadRequestException("User with this email already exists");
        }

        User createdUser = userService.createUser(user);
        if (createdUser != null) {
            return new ResponseEntity<>(createdUser, HttpStatus.OK);
        } else {
            throw new BadRequestException("User not created, come again later");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User dbUser = userService.login(user);
        if (dbUser != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(dbUser.getId());
            userDTO.setName(dbUser.getName());
            userDTO.setEmail(dbUser.getEmail());

            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } else {
            throw new UnauthorizedException("Email and password do not match");
        }
    }
}