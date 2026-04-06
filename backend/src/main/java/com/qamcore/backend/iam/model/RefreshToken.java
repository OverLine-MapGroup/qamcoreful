package com.qamcore.backend.iam.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("refresh_tokens")
public class RefreshToken {
    @Id
    private String token;

    private String username;

    @TimeToLive
    private Long timeToLive;
}