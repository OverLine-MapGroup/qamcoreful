package com.qamcore.backend.iam.repository;

import com.qamcore.backend.iam.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    boolean existsByName(String name);
    Optional<Tenant> findByName(String s);
}