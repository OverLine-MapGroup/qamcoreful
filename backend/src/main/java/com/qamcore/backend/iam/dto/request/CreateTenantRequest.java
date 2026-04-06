package com.qamcore.backend.iam.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTenantRequest {
    @NotBlank(message = "{validation.tenant.name.notblank}")
    @Size(min = 3, max = 100, message = "{validation.tenant.name.size}")
    private String name;
}