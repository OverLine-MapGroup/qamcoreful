package com.qamcore.backend.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qamcore.backend.checkin.dto.response.StudentCaseResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService implements MessageListener {

    private final ObjectMapper objectMapper;
    
    // Store SSE emitters for each student
    private final Map<Long, CopyOnWriteArrayList<SseEmitter>> studentEmitters = new ConcurrentHashMap<>();

    public SseEmitter subscribeToNotifications(Long studentId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        
        // Add emitter to student's list
        studentEmitters.computeIfAbsent(studentId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        
        // Remove emitter when it's completed or timed out
        emitter.onCompletion(() -> removeEmitter(studentId, emitter));
        emitter.onTimeout(() -> removeEmitter(studentId, emitter));
        
        try {
            // Send initial connection event
            emitter.send(SseEmitter.event().name("connected").data("Connected to notifications"));
        } catch (IOException e) {
            log.error("Error sending initial connection event to student {}", studentId, e);
            removeEmitter(studentId, emitter);
        }
        
        log.info("Student {} subscribed to notifications", studentId);
        return emitter;
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String channel = new String(message.getChannel());
            String messageBody = new String(message.getBody());
            
            log.info("Received Redis message on channel: {}", channel);
            
            // Extract student ID from channel name (format: "student:{studentId}:notifications")
            if (channel.startsWith("student:") && channel.endsWith(":notifications")) {
                String[] parts = channel.split(":");
                if (parts.length >= 2) {
                    Long studentId = Long.parseLong(parts[1]);
                    
                    // Parse the message body
                    StudentCaseResponse caseResponse = objectMapper.readValue(messageBody, StudentCaseResponse.class);
                    
                    // Send to all connected emitters for this student
                    CopyOnWriteArrayList<SseEmitter> emitters = studentEmitters.get(studentId);
                    if (emitters != null) {
                        emitters.removeIf(emitter -> {
                            try {
                                emitter.send(SseEmitter.event()
                                    .name("case-update")
                                    .data(objectMapper.writeValueAsString(caseResponse)));
                                return false;
                            } catch (IOException e) {
                                log.error("Error sending notification to student {}", studentId, e);
                                return true; // Remove failed emitter
                            }
                        });
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error processing Redis message", e);
        }
    }

    private void removeEmitter(Long studentId, SseEmitter emitter) {
        CopyOnWriteArrayList<SseEmitter> emitters = studentEmitters.get(studentId);
        if (emitters != null) {
            emitters.remove(emitter);
            if (emitters.isEmpty()) {
                studentEmitters.remove(studentId);
            }
        }
        log.info("Student {} unsubscribed from notifications", studentId);
    }
}
