package com.qamcore.backend.checkin.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OpenCaseRequest {
    @NotBlank(message = "{validation.case.message.notblank}")
    private String message;

    @NotBlank(message = "{validation.case.link.notblank}")
    private String communicationLink;
}