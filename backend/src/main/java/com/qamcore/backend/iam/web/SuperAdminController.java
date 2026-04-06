package com.qamcore.backend.iam.web;

import com.qamcore.backend.iam.dto.request.CreateTenantRequest;
import com.qamcore.backend.iam.dto.response.GlobalStatsResponse;
import com.qamcore.backend.iam.dto.response.StaffResponse;
import com.qamcore.backend.iam.dto.response.TenantResponse;
import com.qamcore.backend.iam.service.TenantService;
import com.qamcore.backend.iam.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/super-admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {
    private final TenantService tenantService;
    private final UserService userService;

    @PostMapping("/tenants")
    public ResponseEntity<TenantResponse> createTenant(@RequestBody @Valid CreateTenantRequest request) {
        return ResponseEntity.ok(tenantService.createTenant(request));
    }

    @GetMapping("/tenants")
    public ResponseEntity<List<TenantResponse>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }

    @PostMapping("/tenants/{tenantId}/create-admin")
    public ResponseEntity<StaffResponse> createSchoolAdmin(@PathVariable Long tenantId) {
        return ResponseEntity.ok(userService.createSchoolAdmin(tenantId));
    }

    @GetMapping("/stats")
    public ResponseEntity<GlobalStatsResponse> getGlobalStats() {
        return ResponseEntity.ok(tenantService.getGlobalStats());
    }
}