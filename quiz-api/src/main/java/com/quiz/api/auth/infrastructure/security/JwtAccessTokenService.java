package com.quiz.api.auth.infrastructure.security;

import com.quiz.api.auth.application.port.out.AccessTokenService;
import com.quiz.api.user.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtAccessTokenService implements AccessTokenService {
    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.access.expiration}")
    private long accessTokenExpiration;

    @Override
    public String issueFor(User user) {
        long now = System.currentTimeMillis();
        return Jwts.builder().subject(user.getEmail()).claim("role", user.getRole().name())
                .issuedAt(new Date(now)).expiration(new Date(now + accessTokenExpiration))
                .signWith(signingKey()).compact();
    }

    @Override
    public Optional<String> subjectOf(String token) {
        try { return Optional.of(claims(token).getSubject()); }
        catch (JwtException | IllegalArgumentException exception) { return Optional.empty(); }
    }

    @Override
    public boolean isValidFor(String token, String subject) {
        try { return subject.equals(claims(token).getSubject()) && claims(token).getExpiration().after(new Date()); }
        catch (JwtException | IllegalArgumentException exception) { return false; }
    }

    private Claims claims(String token) {
        return Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token).getPayload();
    }

    private SecretKey signingKey() {
        return new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }
}
