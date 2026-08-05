package com.quiz.api.security;

import com.quiz.api.shared.security.PasswordHasher;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BCryptPasswordHasher implements PasswordHasher {
    private final PasswordEncoder passwordEncoder;

    @Override
    public String hash(String plainText) { return passwordEncoder.encode(plainText); }

    @Override
    public boolean matches(String plainText, String hash) { return passwordEncoder.matches(plainText, hash); }
}
