package com.qamcore.backend.checkin.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PsychologistBookingResponse {
    private Long psychologistId;
    private String name;
    private String bookingUrl;
}