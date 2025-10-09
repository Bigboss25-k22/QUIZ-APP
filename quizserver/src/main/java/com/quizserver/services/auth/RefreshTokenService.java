package com.quizserver.services.auth;

import com.quizserver.entities.RefreshToken;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(String email);
    RefreshToken verifyExpiration(String token);
}