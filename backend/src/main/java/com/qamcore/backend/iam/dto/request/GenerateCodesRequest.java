package com.qamcore.backend.iam.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class GenerateCodesRequest {
    @Min(value = 1, message = "{validation.generatecodes.amount.min}")
    @Max(value = 100, message = "{validation.generatecodes.amount.max}")
    private int amount;

    private Long groupId;
}