package com.qamcore.backend.iam.service.security;

import com.qamcore.backend.iam.model.RefreshToken;
import com.qamcore.backend.iam.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    @Value("${token.refresh.duration-ms}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken createRefreshToken(String username) {
        RefreshToken refreshToken = RefreshToken.builder()
                .username(username)
                .token(UUID.randomUUID().toString())
                .timeToLive(refreshTokenDurationMs / 1000)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findById(token);
    }

    public void deleteByToken(String token) {
        refreshTokenRepository.deleteById(token);
    }
}