package com.quiz.api.auth.application;

import com.quiz.api.auth.application.port.out.AccessTokenService;
import com.quiz.api.auth.application.port.out.RefreshTokenRepositoryPort;
import com.quiz.api.auth.domain.RefreshToken;
import com.quiz.api.shared.exception.UnauthorizedException;
import com.quiz.api.user.application.UserService;
import com.quiz.api.user.domain.User;
import com.quiz.api.shared.security.PasswordHasher;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final SecureRandom RANDOM = new SecureRandom();
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
        RefreshToken token = refreshTokens.findByTokenHash(hash(value))
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokens.deleteByTokenHash(token.getTokenHash());
            throw new UnauthorizedException("Refresh token has expired");
        }
        User user = users.getById(token.getUserId());
        String replacement = newRawToken();
        refreshTokens.save(new RefreshToken(token.getId(), hash(replacement), token.getUserId(),
                Instant.now().plusMillis(refreshTokenExpiration), token.getCreatedAt()));
        return new TokenPair(accessTokens.issueFor(user, token.getCreatedAt()), replacement);
    }

    @Transactional
    public void logout(String value) {
        refreshTokens.deleteByTokenHash(hash(value));
    }

    private AuthResult authenticate(User user) {
        Instant sessionStartedAt = nextSessionStart(user.getId());
        String refreshToken = newRawToken();
        RefreshToken existing = refreshTokens.findByUserId(user.getId()).orElse(null);
        RefreshToken session = new RefreshToken(existing == null ? null : existing.getId(), hash(refreshToken), user.getId(),
                sessionStartedAt.plusMillis(refreshTokenExpiration), sessionStartedAt);
        refreshTokens.save(session);
        return new AuthResult(accessTokens.issueFor(user, sessionStartedAt), refreshToken, user);
    }

    private Instant nextSessionStart(Long userId) {
        Instant now = Instant.now().truncatedTo(ChronoUnit.MILLIS);
        return refreshTokens.findByUserId(userId)
                .map(existing -> !now.isAfter(existing.getCreatedAt()) ? existing.getCreatedAt().plusMillis(1) : now)
                .orElse(now);
    }

    private String newRawToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }
}
