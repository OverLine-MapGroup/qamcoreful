package com.qamcore.backend.iam.dto.response;

import com.qamcore.backend.iam.model.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnonymousUserResponse {
    private String username;
    private String password;
    private Role role;
    private String accessToken;
    private String orgId;
}
