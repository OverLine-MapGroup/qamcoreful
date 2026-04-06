package com.qamcore.backend.iam.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignInRequest {
    @NotBlank(message = "{validation.auth.username.notblank}")
    private String username;

    @NotBlank(message = "{validation.auth.password.notblank}")
    private String password;
}
