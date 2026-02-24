package com.quizserver.services.auth;

import com.quizserver.entities.RefreshToken;
import com.quizserver.entities.User;

public interface RefreshTokenService {

    /**
     * Create a new refresh token for the given user
     * 
     * @param user The user to create refresh token for
     * @return The created refresh token
     */
    RefreshToken createRefreshToken(User user);

    /**
     * Verify if the refresh token is valid and not expired
     * 
     * @param token The refresh token string
     * @return The verified refresh token entity
     */
    RefreshToken verifyRefreshToken(String token);

    /**
     * Delete refresh token by token string
     * 
     * @param token The refresh token string to delete
     */
    void deleteByToken(String token);

    /**
     * Delete all refresh tokens for a user
     * 
     * @param user The user whose tokens should be deleted
     */
    void deleteByUser(User user);
}
