package com.qamcore.backend.iam.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchoolAdminDashboardStatsRequest {
    private long totalStudents;
    private long totalPsychologist;
    private long unusedCodesCount;
    private double weeklyParticipationRate;
}