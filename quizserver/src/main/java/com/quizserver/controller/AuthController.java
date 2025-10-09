package com.quizserver.controller;

import com.quizserver.config.JwtFilter;
import com.quizserver.repository.UserRepository;
import com.quizserver.services.auth.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

}
