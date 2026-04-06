package com.qamcore.backend.iam.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TenantResponse {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
}