package com.qamcore.backend.iam.repository;

import com.qamcore.backend.iam.model.Role;
import com.qamcore.backend.iam.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    
    @Query("SELECT u FROM User u WHERE u.tenant.id = :tenantId AND u.role = :role")
    Page<User> findAllByTenantIdAndRole(@Param("tenantId") Long tenantId, @Param("role") Role role, Pageable pageable);
}