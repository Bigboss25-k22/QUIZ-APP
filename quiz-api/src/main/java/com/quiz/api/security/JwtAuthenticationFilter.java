package com.quiz.api.security;

import com.quiz.api.auth.application.port.out.AccessTokenService;
import com.quiz.api.auth.application.port.out.RefreshTokenRepositoryPort;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final AccessTokenService tokens;
    private final RefreshTokenRepositoryPort refreshTokens;
    private final SpringSecurityUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }
        String token = authorization.substring(7);
        tokens.parse(token).ifPresent(claims -> {
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                boolean activeSession = refreshTokens.findByUserId(claims.userId())
                        .filter(session -> session.getExpiryDate().isAfter(Instant.now()))
                        .map(session -> session.getCreatedAt().equals(claims.sessionStartedAt()))
                        .orElse(false);
                if (activeSession) {
                    UserDetails user = userDetailsService.loadUserById(claims.userId());
                    SecurityContextHolder.getContext().setAuthentication(
                            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
                }
            }
        });
        chain.doFilter(request, response);
    }
}
