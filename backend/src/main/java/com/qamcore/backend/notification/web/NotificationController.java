package com.qamcore.backend.notification.web;

import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.repository.UserRepository;
import com.qamcore.backend.iam.service.security.JwtService;
import com.qamcore.backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeToNotifications(
            @RequestParam(required = false) String token,
            @AuthenticationPrincipal User student) {
        
        // If token is provided, authenticate user from token
        if (token != null && student == null) {
            try {
                String username = jwtService.extractUserName(token);
                student = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                
                // Validate token
                if (!jwtService.isTokenValid(token, student)) {
                    throw new RuntimeException("Invalid token");
                }
            } catch (Exception e) {
                throw new RuntimeException("Authentication failed");
            }
        }
        
        if (student == null) {
            throw new RuntimeException("Authentication required for notifications");
        }
        
        return notificationService.subscribeToNotifications(student.getId());
    }
}
