package com.qamcore.backend.iam.service;

import com.qamcore.backend.common.context.TenantContext;
import com.qamcore.backend.common.exception.AccessDeniedException;
import com.qamcore.backend.common.exception.ResourceNotFoundException;
import com.qamcore.backend.iam.dto.request.CreateStaffRequest;
import com.qamcore.backend.iam.dto.response.StaffListItemResponse;
import com.qamcore.backend.iam.dto.response.StaffResponse;
import com.qamcore.backend.iam.dto.response.TeacherResponse;
import com.qamcore.backend.iam.model.Role;
import com.qamcore.backend.iam.model.Tenant;
import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final TenantService tenantService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public StaffResponse createSchoolAdmin(Long tenantId) {
        Tenant tenant = tenantService.getTenantById(tenantId);
        String safeName = tenant.getName().replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
        String prefix = safeName.substring(0, Math.min(safeName.length(), 8));

        String username = "ADMIN-" + prefix + "-" + UUID.randomUUID().toString().substring(0, 4);
        String rawPassword = generateSecurePassword();

        User admin = User.builder()
                .username(username)
                .password(passwordEncoder.encode(rawPassword))
                .role(Role.SCHOOL_ADMIN)
                .tenant(tenant)
                .build();

        userRepository.save(admin);

        return StaffResponse.builder()
                .username(username)
                .password(rawPassword)
                .role("SCHOOL_ADMIN")
                .build();
    }

    @CacheEvict(value = "psychologistsList", key = "T(com.qamcore.backend.common.context.TenantContext).getTenantId()")
    @Transactional
    public StaffResponse createStaff(CreateStaffRequest request) {
        Long tenantId = TenantContext.getTenantId();
        Tenant tenant = tenantService.getTenantById(tenantId);

        String[] parts = request.getFullName().split(" ");
        String lastName = parts.length > 0 ? parts[0].replaceAll("[^a-zA-Z]", "") : "User";
        String initial = parts.length > 1 ? parts[1].substring(0, 1) : "X";
        String prefix = "Psy-";

        String username;
        String rawPassword = generateSecurePassword();

        do {
            String shortUuid = UUID.randomUUID().toString().substring(0, 5);
            username = prefix + lastName + initial + "-" + shortUuid;
        } while (userRepository.existsByUsername(username));

        User staff = User.builder()
                .username(username)
                .password(passwordEncoder.encode(rawPassword))
                .role(Role.PSYCHOLOGIST)
                .tenant(tenant)
                .build();

        userRepository.save(staff);

        return StaffResponse.builder()
                .username(username)
                .password(rawPassword)
                .role(Role.PSYCHOLOGIST.name())
                .build();
    }

    @Cacheable(value = "psychologistsList", key = "T(com.qamcore.backend.common.context.TenantContext).getTenantId()")
    public List<StaffListItemResponse> getAllPsychologists() {
        Long tenantId = TenantContext.getTenantId();

        return userRepository.findAllByTenantIdAndRole(tenantId, Role.PSYCHOLOGIST).stream()
                .map(user -> StaffListItemResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .role(user.getRole().name())
                        .build())
                .collect(Collectors.toList());
    }

    public User getStaffByIdAndValidate(Long userId, Long tenantId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("error.staff.notfound"));

        if (!user.getTenant().getId().equals(tenantId)) {
            throw new AccessDeniedException("error.staff.access_denied");
        }
        return user;
    }

    private String generateSecurePassword() {
        final String UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        final String LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
        final String NUMBERS = "0123456789";
        final String SPECIAL_CHARS = "!@#$%^&*()-_=+";
        final String ALL_CHARS = UPPER_CASE + LOWER_CASE + NUMBERS + SPECIAL_CHARS;

        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        password.append(UPPER_CASE.charAt(random.nextInt(UPPER_CASE.length())));
        password.append(LOWER_CASE.charAt(random.nextInt(LOWER_CASE.length())));
        password.append(NUMBERS.charAt(random.nextInt(NUMBERS.length())));
        password.append(SPECIAL_CHARS.charAt(random.nextInt(SPECIAL_CHARS.length())));

        for (int i = 4; i < 12; i++) {
            password.append(ALL_CHARS.charAt(random.nextInt(ALL_CHARS.length())));
        }

        List<Character> passwordChars = password.chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.toList());
        Collections.shuffle(passwordChars, random);

        return passwordChars.stream()
                .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                .toString();
    }
}