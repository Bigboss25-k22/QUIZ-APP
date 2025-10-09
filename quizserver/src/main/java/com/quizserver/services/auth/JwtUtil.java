package com.quizserver.services.auth;

import com.quizserver.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private  String SECRET_KEY;

    @Value("${jwt.access.expiration}")
    private long ACCESS_TOKEN_EXPIRATION;

    @Value("${jwt.refresh.expiration}")
    private long REFRESH_TOKEN_EXPIRATION;


    private Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    public String generateAccessToken(User user) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(new java.util.Date(now))
                .expiration(new java.util.Date(now + ACCESS_TOKEN_EXPIRATION))
                .signWith(getSigningKey())
                .compact();
    }

    public String generateRefreshToken(User user) {

        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(new java.util.Date(now))
                .expiration(new java.util.Date(now + REFRESH_TOKEN_EXPIRATION))
                .signWith(getSigningKey())
                .compact();
    }

    public Claims extractClaims(String token){
        return Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token, User user) {
        final String email = extractClaims(token).getSubject();
        return (email.equals(user.getEmail()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }


}
