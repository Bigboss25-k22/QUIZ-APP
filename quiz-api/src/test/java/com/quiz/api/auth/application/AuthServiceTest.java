package com.quiz.api.auth.application;

import com.quiz.api.auth.application.port.out.AccessTokenService;
import com.quiz.api.auth.application.port.out.RefreshTokenRepositoryPort;
import com.quiz.api.auth.domain.RefreshToken;
import com.quiz.api.shared.security.PasswordHasher;
import com.quiz.api.user.application.UserService;
import com.quiz.api.user.domain.User;
import com.quiz.api.user.domain.UserRole;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock private UserService users;
    @Mock private PasswordHasher passwordHasher;
    @Mock private RefreshTokenRepositoryPort refreshTokens;
    @Mock private AccessTokenService accessTokens;
    @InjectMocks private AuthService service;

    @Test
    void loginReplacesTheExistingSingleUserSessionInsteadOfInsertingAnotherOne() {
        ReflectionTestUtils.setField(service, "refreshTokenExpiration", 604_800_000L);
        User user = new User(4L, "an@example.com", "hashed-password", "Nguyễn An", UserRole.USER);
        RefreshToken existing = new RefreshToken(18L, "old-hash", 4L, Instant.now().plusSeconds(60), Instant.now().minusSeconds(60));
        when(users.getByEmail(user.getEmail())).thenReturn(user);
        when(passwordHasher.matches("password", user.getPassword())).thenReturn(true);
        when(refreshTokens.findByUserId(4L)).thenReturn(Optional.of(existing));
        when(refreshTokens.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(accessTokens.issueFor(eq(user), any())).thenReturn("access-token");

        AuthResult result = service.login(user.getEmail(), "password");

        ArgumentCaptor<RefreshToken> tokenCaptor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokens).save(tokenCaptor.capture());
        assertThat(tokenCaptor.getValue().getId()).isEqualTo(existing.getId());
        assertThat(tokenCaptor.getValue().getTokenHash()).isNotEqualTo(existing.getTokenHash());
        assertThat(result.refreshToken()).isNotEqualTo(tokenCaptor.getValue().getTokenHash());
        verify(refreshTokens, never()).deleteByTokenHash(any());
        verify(refreshTokens, never()).findByTokenHash(any());
    }
}
