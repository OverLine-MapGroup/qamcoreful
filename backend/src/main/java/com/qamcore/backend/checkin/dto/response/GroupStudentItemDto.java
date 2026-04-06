package com.qamcore.backend.checkin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupStudentItemDto {
    private Long studentId;
    private String displayName;
    private String lastRiskLevel;
    private int lastScore;
    private LocalDateTime lastCheckInAt;
}