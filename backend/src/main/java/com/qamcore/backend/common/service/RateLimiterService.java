package com.qamcore.backend.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class RateLimiterService {
    private final StringRedisTemplate redisTemplate;

    public boolean isAllowedToday(Long userId, String action, int maxAllowed) {
        String key = String.format("rate_limit:%s:user:%d:%s", action, userId, LocalDate.now().toString());

        Long currentCount = redisTemplate.opsForValue().increment(key);

        if (currentCount != null && currentCount == 1) {
            redisTemplate.expire(key, Duration.ofDays(1));
        }

        return currentCount != null && currentCount <= maxAllowed;
    }
}