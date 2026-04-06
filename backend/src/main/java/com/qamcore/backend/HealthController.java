package com.qamcore.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
public class HealthController {
    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        long uptimeMillis = ManagementFactory.getRuntimeMXBean().getUptime();
        Duration duration = Duration.ofMillis(uptimeMillis);
        String formattedUptime = String.format("%dd %dh %dm %ds",
                duration.toDays(),
                duration.toHoursPart(),
                duration.toMinutesPart(),
                duration.toSecondsPart());

        return Map.of(
                "status", "UP",
                "version", "0.0.1-MVP",
                "uptime", formattedUptime,
                "note", "From our hearts — with gratitude, warmth and respect to those on the other side of the request. 🤍",
                "energy_source", "Coffee & Passion",
                "heartbeat", "🤍"
        );
    }
}