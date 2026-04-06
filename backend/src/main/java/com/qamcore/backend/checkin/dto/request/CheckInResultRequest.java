package com.qamcore.backend.checkin.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;

@Data
public class CheckInResultRequest {
    @NotNull(message = "{validation.checkin.id.notnull}")
    private String checkinId;

    @NotNull(message = "{validation.checkin.answers.notnull}")
    private Map<String, Integer> answers;
}