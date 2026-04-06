package com.qamcore.backend.complaint.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ComplaintResponse {
    private Long id;
    private String category;
    private String status;
    private String text;
    private String location;
    private String resolutionComment;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}