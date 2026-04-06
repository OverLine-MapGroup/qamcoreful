package com.qamcore.backend.iam.dto.response;

import com.qamcore.backend.iam.model.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String accessToken;
    private String refreshToken;
    private String username;
    private Role role;
}