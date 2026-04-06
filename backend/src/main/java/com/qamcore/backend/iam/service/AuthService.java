package com.qamcore.backend.iam.service;

import com.qamcore.backend.common.exception.AccessDeniedException;
import com.qamcore.backend.common.exception.ResourceNotFoundException;
import com.qamcore.backend.common.metrics.BusinessMetricsService;
import com.qamcore.backend.iam.dto.request.SignInRequest;
import com.qamcore.backend.iam.dto.request.SignUpRequest;
import com.qamcore.backend.iam.dto.response.JwtAuthenticationResponse;
import com.qamcore.backend.iam.model.*;
import com.qamcore.backend.iam.repository.*;
import com.qamcore.backend.iam.service.security.JwtService;
import com.qamcore.backend.iam.service.security.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final InviteCodeRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final BusinessMetricsService businessMetricsService;

    @Transactional
    public JwtAuthenticationResponse registerStudent(SignUpRequest request) {
        var token = tokenRepository.findByCode(request.getInviteCode())
                .orElseThrow(() -> new ResourceNotFoundException("error.auth.invitecode.invalid"));

        if (token.getUser() != null) {
            throw new AccessDeniedException("error.auth.invitecode.used");
        }

        String anonymousUsername = "Student-" + UUID.randomUUID().toString().substring(0, 8);

        var user = User.builder()
                .username(anonymousUsername)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .tenant(token.getTenant())
                .group(token.getGroup())
                .build();

        user = userRepository.save(user);

        token.setUsedAt(LocalDateTime.now());
        token.setUser(user);
        tokenRepository.save(token);

        var jwt = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

        Long groupId = token.getGroup() != null ? token.getGroup().getId() : null;
        businessMetricsService.incrementInviteCodeActivated(token.getTenant().getId(), groupId);
        businessMetricsService.incrementLogin(user.getRole().name(), user.getTenant().getId());

        return JwtAuthenticationResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .username(anonymousUsername)
                .role(user.getRole())
                .build();
    }

    public JwtAuthenticationResponse login(SignInRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("error.auth.credentials.invalid"));

        var jwt = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

        businessMetricsService.incrementLogin(user.getRole().name(), user.getTenant().getId());

        return JwtAuthenticationResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }
}