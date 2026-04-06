package com.qamcore.backend.checkin.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PsychologistStatsResponse {
    private long riskGroupCount;
    private long totalStudents;
    private int riskPercentage;
    private long activeToday;
    private boolean hasBookingUrl;
}