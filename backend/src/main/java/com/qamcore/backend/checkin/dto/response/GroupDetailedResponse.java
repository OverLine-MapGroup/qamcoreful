package com.qamcore.backend.checkin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupDetailedResponse {
    private Long groupId;
    private String groupName;

    private int totalStudents;
    private double participationRate;
    private long unusedCodesCount;

    private long redRiskCount;
    private long yellowRiskCount;
    private long greenRiskCount;

    private List<GroupStudentItemDto> students;
}