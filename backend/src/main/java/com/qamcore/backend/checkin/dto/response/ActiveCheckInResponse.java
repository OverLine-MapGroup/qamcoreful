package com.qamcore.backend.checkin.dto.response;

import com.qamcore.backend.checkin.model.CheckInStatus;
import com.qamcore.backend.checkin.service.CheckInConfig;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ActiveCheckInResponse {
    private String checkInId;
    private CheckInStatus status;
    private LocalDateTime deadline;
    private String message;
    private List<CheckInConfig.Question> questions;
}