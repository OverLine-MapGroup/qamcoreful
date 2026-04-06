package com.qamcore.backend.iam.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SchoolStatsResponse {
    private long totalStudents;
    private long totalTeachers;
    private long activeIncidents;
    private long unusedCodes;
}