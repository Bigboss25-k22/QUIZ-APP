package com.quiz.api.auth.application;

import com.quiz.api.auth.application.port.out.AccessTokenService;
import com.quiz.api.auth.application.port.out.RefreshTokenRepositoryPort;
import com.quiz.api.auth.domain.RefreshToken;
import com.quiz.api.shared.exception.BadRequestException;
import com.quiz.api.shared.exception.UnauthorizedException;
import com.quiz.api.user.application.UserService;
import com.quiz.api.user.domain.User;
import com.quiz.api.shared.security.PasswordHasher;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService users;
    private final PasswordHasher passwordHasher;
    private final RefreshTokenRepositoryPort refreshTokens;
    private final AccessTokenService accessTokens;

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenExpiration;

    @Transactional
    public AuthResult signup(String email, String password, String name) {
        User user = users.register(email, password, name);
        return authenticate(user);
    }

    @Transactional
    public AuthResult login(String email, String password) {
        User user;
        try {
            user = users.getByEmail(email);
        } catch (RuntimeException exception) {
            throw new UnauthorizedException("Invalid email or password");
        }
        if (!passwordHasher.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        return authenticate(user);
    }

    @Transactional
    public TokenPair refresh(String value) {
        RefreshToken token = refreshTokens.findByToken(value)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokens.deleteByToken(value);
            throw new BadRequestException("Refresh token has expired");
        }
        User user = users.getById(token.getUserId());
        RefreshToken replacement = createRefreshToken(user.getId());
        return new TokenPair(accessTokens.issueFor(user), replacement.getToken());
    }

    @Transactional
    public void logout(String value) {
        refreshTokens.deleteByToken(value);
    }

    private AuthResult authenticate(User user) {
        RefreshToken refreshToken = createRefreshToken(user.getId());
        return new AuthResult(accessTokens.issueFor(user), refreshToken.getToken(), user);
    }

    private RefreshToken createRefreshToken(Long userId) {
        refreshTokens.deleteByUserId(userId);
        Instant now = Instant.now();
        return refreshTokens.save(new RefreshToken(null, UUID.randomUUID().toString(), userId,
                now.plusMillis(refreshTokenExpiration), now));
    }
}
