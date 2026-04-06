package com.qamcore.backend.complaint.dto.request;

import com.qamcore.backend.complaint.model.ComplaintCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintRequest {
    @NotNull(message = "{validation.complaint.category.notnull}")
    private ComplaintCategory category;
    @NotBlank(message = "{validation.complaint.text.notblank}")
    private String text;
    private String location;
}