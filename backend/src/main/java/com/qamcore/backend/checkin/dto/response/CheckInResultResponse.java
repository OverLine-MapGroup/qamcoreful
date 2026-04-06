package com.qamcore.backend.checkin.dto.response;

import com.qamcore.backend.checkin.model.RiskLevel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckInResultResponse {
    private String status;
}