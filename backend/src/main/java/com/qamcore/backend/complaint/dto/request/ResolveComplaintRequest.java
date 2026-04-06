package com.qamcore.backend.complaint.dto.request;

import com.qamcore.backend.complaint.model.ComplaintStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResolveComplaintRequest {
    @NotNull(message = "{validation.resolve.status.notnull}")
    private ComplaintStatus status;
    private String resolutionComment;
}