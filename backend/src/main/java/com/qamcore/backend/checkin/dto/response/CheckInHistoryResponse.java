package com.qamcore.backend.checkin.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CheckInHistoryResponse {
    private Long checkInId;
    private LocalDateTime date;
    private int score;
    private String riskLevel;
    private String answersJson;
}