package com.qamcore.backend.iam.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateGroupRequest {
    @NotBlank(message = "{validation.group.name.notblank}")
    private String name;

    private Long curatorId;
}