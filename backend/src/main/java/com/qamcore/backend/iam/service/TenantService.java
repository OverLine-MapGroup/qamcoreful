package com.qamcore.backend.iam.service;

import com.qamcore.backend.common.exception.BusinessValidationException;
import com.qamcore.backend.common.exception.ResourceNotFoundException;
import com.qamcore.backend.iam.dto.request.CreateTenantRequest;
import com.qamcore.backend.iam.dto.response.GlobalStatsResponse;
import com.qamcore.backend.iam.dto.response.TenantResponse;
import com.qamcore.backend.iam.model.Role;
import com.qamcore.backend.iam.model.Tenant;
import com.qamcore.backend.iam.repository.TenantRepository;
import com.qamcore.backend.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TenantService {
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;

    @Transactional
    public TenantResponse createTenant(CreateTenantRequest request) {
        if (tenantRepository.existsByName(request.getName())) {
            throw new BusinessValidationException("error.tenant.duplicate_name");
        }

        Tenant tenant = Tenant.builder()
                .name(request.getName())
                .build();

        tenant = tenantRepository.save(tenant);

        return mapToResponse(tenant);
    }

    public List<TenantResponse> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Tenant getTenantById(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("error.tenant.notfound"));
    }

    public GlobalStatsResponse getGlobalStats() {
        return GlobalStatsResponse.builder()
                .totalTenants(tenantRepository.count())
                .totalUsers(userRepository.count())
                .totalStudents(userRepository.countByRole(Role.STUDENT))
                .build();
    }

    private TenantResponse mapToResponse(Tenant tenant) {
        return TenantResponse.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .createdAt(tenant.getCreatedAt())
                .build();
    }
}