package com.qamcore.backend.iam.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GlobalStatsResponse {
    private long totalTenants;
    private long totalUsers;
    private long totalStudents;
}