package com.qamcore.backend.iam.service;

import com.qamcore.backend.common.context.TenantContext;
import com.qamcore.backend.common.exception.BusinessValidationException;
import com.qamcore.backend.iam.dto.request.CreateGroupRequest;
import com.qamcore.backend.iam.dto.response.GroupResponse;
import com.qamcore.backend.iam.model.Role;
import com.qamcore.backend.iam.model.StudentGroup;
import com.qamcore.backend.iam.model.Tenant;
import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.repository.StudentGroupRepository;
import com.qamcore.backend.iam.repository.TenantRepository;
import com.qamcore.backend.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentGroupService {
    private final StudentGroupRepository groupRepository;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;

    @CacheEvict(value = "groupsList", key = "T(com.qamcore.backend.common.context.TenantContext).getTenantId()")
    @Transactional
    public GroupResponse createGroup(CreateGroupRequest request) {
        Long tenantId = TenantContext.getTenantId();

        if (groupRepository.existsByNameAndTenantId(request.getName(), tenantId)) {
            throw new BusinessValidationException("error.studentgroup.duplicate_name");
        }

        Tenant tenant = tenantRepository.getReferenceById(tenantId);
        StudentGroup group = StudentGroup.builder()
                .name(request.getName())
                .tenant(tenant)
                .build();

        group = groupRepository.save(group);
        return mapToResponse(group);
    }

    @Cacheable(value = "groupsList", key = "T(com.qamcore.backend.common.context.TenantContext).getTenantId()")
    public List<GroupResponse> getAllGroups() {
        Long tenantId = TenantContext.getTenantId();
        return groupRepository.findAllByTenantId(tenantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private GroupResponse mapToResponse(StudentGroup group) {
        return GroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .build();
    }
}