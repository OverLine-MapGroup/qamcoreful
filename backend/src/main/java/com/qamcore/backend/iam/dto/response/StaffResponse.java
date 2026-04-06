package com.qamcore.backend.iam.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StaffResponse {
    private String username;
    private String password;
    private String role;
}