package com.qamcore.backend.iam.dto.request;

import com.qamcore.backend.iam.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateStaffRequest {
    @NotBlank(message = "{validation.staff.fullname.notblank}")
    private String fullName;

    @NotNull(message = "{validation.staff.role.notnull}")
    private Role role;
}