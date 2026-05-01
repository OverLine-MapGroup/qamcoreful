package com.qamcore.backend.iam.service;

import com.qamcore.backend.common.exception.AccessDeniedException;
import com.qamcore.backend.common.exception.ResourceNotFoundException;
import com.qamcore.backend.common.metrics.BusinessMetricsService;
import com.qamcore.backend.iam.dto.request.SignInRequest;
import com.qamcore.backend.iam.dto.request.SignUpRequest;
import com.qamcore.backend.iam.dto.response.JwtAuthenticationResponse;
import com.qamcore.backend.iam.dto.response.AnonymousUserResponse;
import com.qamcore.backend.iam.model.*;
import com.qamcore.backend.iam.repository.*;
import com.qamcore.backend.iam.service.security.JwtService;
import com.qamcore.backend.iam.service.security.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
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
    public AnonymousUserResponse registerStudent(SignUpRequest request) {
        log.info("Attempting to register student with inviteCode: {}", request.getInviteCode());

        // Input validation for null/empty inviteCode
        if (request.getInviteCode() == null || request.getInviteCode().trim().isEmpty()) {
            log.error("InviteCode is null or empty");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invite code cannot be null or empty");
        }

        String sanitizedCode = request.getInviteCode().trim().replaceAll("\\s+", "");
        log.info("Looking for inviteCode after sanitization: '{}'", sanitizedCode);

        var token = tokenRepository.findByCode(sanitizedCode)
                .orElseThrow(() -> {
                    log.error("InviteCode not found: '{}'", sanitizedCode);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Invite code not found");
                });

        if (token.getUser() != null) {
            log.error("InviteCode already used: '{}'", sanitizedCode);
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Invite code already used");
        }

        // Verify dependencies are not null
        if (token.getTenant() == null) {
            log.error("InviteCode has null tenant: '{}'", sanitizedCode);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invite code configuration error: missing tenant");
        }
        
        if (token.getTenant().getId() == null) {
            log.error("InviteCode has null tenant ID: '{}'", sanitizedCode);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invite code configuration error: missing tenant ID");
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
        log.info("User saved successfully with ID: {}", user.getId());

        String jwt;
        try {
            log.info("Generating JWT token for user: {}", user.getUsername());
            jwt = jwtService.generateToken(user);
            log.info("JWT token generated successfully");
        } catch (Exception e) {
            log.error("Failed to generate JWT token", e);
            throw new RuntimeException("JWT generation failed", e);
        }

        try {
            log.info("Creating refresh token for user: {}", user.getUsername());
            var refreshToken = refreshTokenService.createRefreshToken(user.getUsername());
            log.info("Refresh token created successfully");
        } catch (Exception e) {
            log.error("Failed to create refresh token", e);
            throw new RuntimeException("Refresh token creation failed", e);
        }

        try {
            Long groupId = token.getGroup() != null ? token.getGroup().getId() : null;
            log.info("Incrementing business metrics for tenant: {}, group: {}", token.getTenant().getId(), groupId);
            businessMetricsService.incrementInviteCodeActivated(token.getTenant().getId(), groupId);
            businessMetricsService.incrementLogin(user.getRole().name(), user.getTenant().getId());
            log.info("Business metrics incremented successfully");
        } catch (Exception e) {
            log.error("Failed to increment business metrics", e);
            // Don't throw here - metrics failure shouldn't break registration
        }

        return AnonymousUserResponse.builder()
                .username(anonymousUsername)
                .password(request.getPassword())
                .role(user.getRole())
                .accessToken(jwt)
                .orgId(token.getTenant().getId().toString())
                .build();
    }

    public JwtAuthenticationResponse login(SignInRequest request) {
        try {
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
        } catch (BadCredentialsException e) {
            throw new ResourceNotFoundException("error.auth.credentials.invalid");
        } catch (DisabledException e) {
            throw new ResourceNotFoundException("error.auth.account.disabled");
        } catch (LockedException e) {
            throw new ResourceNotFoundException("error.auth.account.locked");
        } catch (Exception e) {
            throw new ResourceNotFoundException("error.auth.server.error");
        }
    }
}