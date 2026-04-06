package com.qamcore.backend.iam.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignUpRequest {
    @NotBlank(message = "{validation.auth.invitecode.notblank}")
    private String inviteCode;

    @NotBlank(message = "{validation.auth.password.notblank}")
    @Size(min = 8, message = "{validation.auth.password.size}")
    private String password;
}
