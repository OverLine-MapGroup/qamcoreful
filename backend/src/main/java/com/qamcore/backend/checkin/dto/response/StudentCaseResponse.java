package com.qamcore.backend.checkin.dto.response;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
public class StudentCaseResponse implements Serializable {
    private Long caseId;
    private String psychologistName;
    private String message;
    private String communicationLink;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}