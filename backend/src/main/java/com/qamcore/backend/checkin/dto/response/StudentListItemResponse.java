package com.qamcore.backend.checkin.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class StudentListItemResponse {
    private Long studentId;
    private String displayName;
    private String riskLevel;
    private int riskScore;
    private LocalDateTime lastCheckInAt;
    private boolean hasSos;
}