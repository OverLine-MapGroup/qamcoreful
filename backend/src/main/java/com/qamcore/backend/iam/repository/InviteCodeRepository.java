package com.qamcore.backend.iam.repository;

import com.qamcore.backend.iam.model.InviteCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InviteCodeRepository extends JpaRepository<InviteCode, Long> {
    Optional<InviteCode> findByCode(String code);
    long countByTenantIdAndUserIsNull(Long tenantId);
    long countByGroupIdAndUserIsNull(Long groupId);
    List<InviteCode> findAllByGroupIdAndUserIsNull(Long groupId);
    List<InviteCode> findAllByTenantIdAndUserIsNull(Long tenantId);
}