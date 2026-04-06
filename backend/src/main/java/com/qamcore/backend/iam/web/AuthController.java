package com.qamcore.backend.iam.web;

import com.qamcore.backend.common.exception.AccessDeniedException;
import com.qamcore.backend.common.exception.ResourceNotFoundException;
import com.qamcore.backend.iam.dto.request.SignInRequest;
import com.qamcore.backend.iam.dto.request.SignUpRequest;
import com.qamcore.backend.iam.dto.response.JwtAuthenticationResponse;
import com.qamcore.backend.iam.model.RefreshToken;
import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.repository.UserRepository;
import com.qamcore.backend.iam.service.AuthService;
import com.qamcore.backend.iam.service.security.JwtService;
import com.qamcore.backend.iam.service.security.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    private static final String REFRESH_COOKIE_NAME = "refresh_token";

    @Value("${token.refresh.duration-ms}")
    private Long refreshTokenDurationMs;

    @PostMapping("/register-anonymous")
    public ResponseEntity<JwtAuthenticationResponse> register(@RequestBody @Valid SignUpRequest request, HttpServletResponse response) {
        JwtAuthenticationResponse authResponse = authService.registerStudent(request);
        setRefreshTokenCookie(response, authResponse.getRefreshToken());
        authResponse.setRefreshToken(null);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponse> login(@RequestBody @Valid SignInRequest request, HttpServletResponse response) {
        JwtAuthenticationResponse loginResponse = authService.login(request);
        setRefreshTokenCookie(response, loginResponse.getRefreshToken());
        loginResponse.setRefreshToken(null);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenStr = getCookieValue(request, REFRESH_COOKIE_NAME);

        if (refreshTokenStr == null) {
            throw new AccessDeniedException("error.refresh.token.missing");
        }

        return refreshTokenService.findByToken(refreshTokenStr)
                .map(oldToken -> {
                    refreshTokenService.deleteByToken(oldToken.getToken());

                    User user = userRepository.findByUsername(oldToken.getUsername())
                            .orElseThrow(() -> new ResourceNotFoundException("error.user.notfound"));

                    RefreshToken rotatedToken = refreshTokenService.createRefreshToken(user.getUsername());
                    setRefreshTokenCookie(response, rotatedToken.getToken());

                    String newJwt = jwtService.generateToken(user);

                    return ResponseEntity.ok(JwtAuthenticationResponse.builder()
                            .accessToken(newJwt)
                            .username(user.getUsername())
                            .role(user.getRole())
                            .build());
                })
                .orElseThrow(() -> new AccessDeniedException("error.refresh.token.invalid"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie(REFRESH_COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/api/v1/auth/refresh-token");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok("Logged out");
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(REFRESH_COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/api/v1/auth/refresh-token");
        int maxAgeInSeconds = (int) (refreshTokenDurationMs / 1000);
        cookie.setMaxAge(maxAgeInSeconds);
        response.addCookie(cookie);
    }

    private String getCookieValue(HttpServletRequest req, String cookieName) {
        if (req.getCookies() != null) {
            return Arrays.stream(req.getCookies())
                    .filter(c -> c.getName().equals(cookieName))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);
        }
        return null;
    }
}