package com.qamcore.backend.checkin.dto.response;

public interface GroupStatsProjection {
    Long getGroupId();
    String getGroupName();
    Integer getTotalStudents();
    Integer getActiveStudents();
    Integer getUnusedCodes();
}