package com.qamcore.backend.iam.repository;

import com.qamcore.backend.iam.model.Role;
import com.qamcore.backend.iam.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    long countByRole(Role role);
    long countByTenantIdAndRole(Long tenantId, Role role);
    boolean existsByUsername(String username);
    List<User> findAllByGroupId(Long id);
    long countByTenantId(Long tenantId);
    List<User> findAllByTenantId(Long tenantId);
    List<User> findAllByTenantIdAndRole(Long tenantId, Role role);
}