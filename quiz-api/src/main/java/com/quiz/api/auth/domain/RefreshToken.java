package com.quiz.api.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    private Long id;
    private String tokenHash;
    private Long userId;
    private Instant expiryDate;
    private Instant createdAt;
}
