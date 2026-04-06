package com.qamcore.backend.checkin.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class StudentDetailResponse {
    private Long id;
    private String anonymousId;
    private String groupName;
}