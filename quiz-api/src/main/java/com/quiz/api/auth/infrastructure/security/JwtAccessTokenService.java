package com.quiz.api.auth.infrastructure.security;

import com.quiz.api.auth.application.port.out.AccessTokenService;
import com.quiz.api.auth.application.port.out.AccessTokenClaims;
import com.quiz.api.user.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtAccessTokenService implements AccessTokenService {
    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.access.expiration}")
    private long accessTokenExpiration;

    @Override
    public String issueFor(User user, Instant sessionStartedAt) {
        long now = System.currentTimeMillis();
        return Jwts.builder().subject(user.getId().toString()).claim("role", user.getRole().name())
                .claim("sessionStartedAt", sessionStartedAt.toEpochMilli())
                .issuedAt(new Date(now)).expiration(new Date(now + accessTokenExpiration))
                .signWith(signingKey()).compact();
    }

    @Override
    public Optional<AccessTokenClaims> parse(String token) {
        try {
            Claims claims = claims(token);
            Long userId = Long.valueOf(claims.getSubject());
            Number sessionStartedAt = claims.get("sessionStartedAt", Number.class);
            if (sessionStartedAt == null) return Optional.empty();
            return Optional.of(new AccessTokenClaims(userId, Instant.ofEpochMilli(sessionStartedAt.longValue())));
        }
        catch (JwtException | IllegalArgumentException exception) { return Optional.empty(); }
    }

    private Claims claims(String token) {
        return Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token).getPayload();
    }

    private SecretKey signingKey() {
        return new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }
}
