package com.qamcore.backend;

import com.qamcore.backend.iam.model.Role;
import com.qamcore.backend.iam.model.Tenant;
import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.repository.TenantRepository;
import com.qamcore.backend.iam.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.qamcore.backend")
@EntityScan(basePackages = "com.qamcore.backend")
public class QamcoreBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(QamcoreBackendApplication.class, args);
	}
}