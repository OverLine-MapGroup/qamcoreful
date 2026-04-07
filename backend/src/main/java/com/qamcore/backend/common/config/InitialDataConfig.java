package com.qamcore.backend.common.config;

import com.qamcore.backend.iam.model.Role;
import com.qamcore.backend.iam.model.Tenant;
import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.repository.TenantRepository;
import com.qamcore.backend.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class InitialDataConfig {
    @Value("${app.init.admin-password:admin}")
    private String initPassword;

    @Bean
    public CommandLineRunner startupTask(UserRepository userRepo,
                                         TenantRepository tenantRepo,
                                         PasswordEncoder passwordEncoder) {
        return args -> {
            // Force Admin Creation: Delete existing super-admin-1 if present to ensure password fix
            userRepo.findByUsername("super-admin-1").ifPresent(user -> userRepo.delete(user));

            if (userRepo.count() == 0 || !userRepo.existsByUsername("super-admin-1")) {
                Tenant systemTenant = tenantRepo.findByName("SYSTEM")
                        .orElseGet(() -> tenantRepo.save(Tenant.builder().name("SYSTEM").build()));

                User superAdmin = User.builder()
                        .username("super-admin-1")
                        .password(passwordEncoder.encode(initPassword))
                        .tenant(systemTenant)
                        .role(Role.SUPER_ADMIN)
                        .build();

                userRepo.save(superAdmin);
            }
        };
    }
}