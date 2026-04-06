package com.qamcore.backend.iam.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipationStatsRequest {
    private Long groupId;
    private String groupName;
    private int totalStudents;
    private int activeStudents;
    private double participationPercentage;
    private long unusedCodes;
}