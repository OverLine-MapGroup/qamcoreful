package com.qamcore.backend.iam.service;

import com.qamcore.backend.common.context.TenantContext;
import com.qamcore.backend.common.exception.AccessDeniedException;
import com.qamcore.backend.common.exception.ResourceNotFoundException;
import com.qamcore.backend.iam.dto.request.GenerateCodesRequest;
import com.qamcore.backend.iam.model.InviteCode;
import com.qamcore.backend.iam.model.StudentGroup;
import com.qamcore.backend.iam.model.Tenant;
import com.qamcore.backend.iam.repository.InviteCodeRepository;
import com.qamcore.backend.iam.repository.StudentGroupRepository;
import com.qamcore.backend.iam.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InviteCodeService {
    private final InviteCodeRepository tokenRepository;
    private final StudentGroupRepository groupRepository;
    private final TenantRepository tenantRepository;

    @Transactional
    public List<String> generateBulkCodes(GenerateCodesRequest request) {
        Long tenantId = TenantContext.getTenantId();
        Tenant tenant = tenantRepository.getReferenceById(tenantId);

        StudentGroup group = null;
        if (request.getGroupId() != null) {
            group = groupRepository.findById(request.getGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("error.group.notfound"));

            if (!group.getTenant().getId().equals(tenantId)) {
                throw new AccessDeniedException("error.invitecode.foreign_group_access_denied");
            }
        }

        String prefix = tenant.getName().length() > 3
                ? tenant.getName().substring(0, 3).toUpperCase()
                : "SCH";

        List<String> generatedCodes = new ArrayList<>();

        for (int i = 0; i < request.getAmount(); i++) {
            String code = prefix + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

            InviteCode invite = InviteCode.builder()
                    .code(code)
                    .tenant(tenant)
                    .group(group)
                    .build();

            tokenRepository.save(invite);
            generatedCodes.add(code);
        }

        return generatedCodes;
    }

    public List<String> getUnusedCodesByGroup(Long groupId) {
        Long tenantId = TenantContext.getTenantId();
        StudentGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("error.group.notfound"));

        if (!group.getTenant().getId().equals(tenantId)) {
            throw new AccessDeniedException("error.invitecode.access_denied");
        }

        List<InviteCode> codes = tokenRepository.findAllByGroupIdAndUserIsNull(groupId);

        return codes.stream()
                .map(InviteCode::getCode)
                .collect(Collectors.toList());
    }
}