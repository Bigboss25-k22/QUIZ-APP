package com.quizserver.services.auth;

import com.quizserver.entities.RefreshToken;
import com.quizserver.entities.User;
import com.quizserver.repository.RefreshTokenRepository;
import com.quizserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService{

    @Value("${jwt.refresh.expiration}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshToken createRefreshToken(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.ofEpochMilli(System.currentTimeMillis() + refreshTokenDurationMs));

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(String token){
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if(refreshToken.getExpiryDate().isBefore(Instant.now())){
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }

        return refreshToken;
    }
}
