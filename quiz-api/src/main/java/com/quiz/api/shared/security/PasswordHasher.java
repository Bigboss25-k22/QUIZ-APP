package com.quiz.api.shared.security;

public interface PasswordHasher {
    String hash(String plainText);
    boolean matches(String plainText, String hash);
}
