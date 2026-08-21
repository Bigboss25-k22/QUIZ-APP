package com.quiz.api.auth.api;

import com.quiz.api.auth.api.dto.AuthResponse;
import com.quiz.api.auth.api.dto.LoginRequest;
import com.quiz.api.auth.api.dto.LogoutRequest;
import com.quiz.api.auth.api.dto.RefreshRequest;
import com.quiz.api.auth.api.dto.SignupRequest;
import com.quiz.api.auth.api.dto.TokenResponse;
import com.quiz.api.auth.application.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(AuthApiMapper.toResponse(authService.signup(request.getEmail(), request.getPassword(), request.getName())));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(AuthApiMapper.toResponse(authService.login(request.getEmail(), request.getPassword())));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(AuthApiMapper.toResponse(authService.refresh(request.getRefreshToken())));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok().build();
    }
}
