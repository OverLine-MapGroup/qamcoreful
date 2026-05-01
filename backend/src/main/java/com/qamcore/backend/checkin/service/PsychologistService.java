package com.qamcore.backend.checkin.service;

import com.qamcore.backend.checkin.dto.response.CheckInHistoryResponse;
import com.qamcore.backend.checkin.dto.response.PsychologistStatsResponse;
import com.qamcore.backend.checkin.dto.response.StudentDetailResponse;
import com.qamcore.backend.checkin.dto.response.StudentListItemResponse;
import com.qamcore.backend.checkin.model.CheckIn;
import com.qamcore.backend.checkin.model.RiskLevel;
import com.qamcore.backend.checkin.repository.CheckInRepository;
import com.qamcore.backend.common.context.TenantContext;
import com.qamcore.backend.common.exception.AccessDeniedException;
import com.qamcore.backend.common.exception.ResourceNotFoundException;
import com.qamcore.backend.common.metrics.BusinessMetricsService;
import com.qamcore.backend.iam.model.Role;
import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PsychologistService {
    private final CheckInRepository checkInRepository;
    private final UserRepository userRepository;
    private final BusinessMetricsService businessMetricsService;

    public PsychologistStatsResponse getDashboardStats(User psychologist) {
        Long tenantId = TenantContext.getTenantId();

        try {
            long totalStudents = userRepository.countByTenantIdAndRole(tenantId, Role.STUDENT);
            long activeToday = checkInRepository.countActiveToday(tenantId, LocalDate.now().atStartOfDay());

            Map<Long, CheckIn> latestCheckIns = getLatestCheckInsMap(tenantId);

            long highRiskCount = latestCheckIns.values().stream()
                    .filter(c -> c != null && c.getRiskLevel() != null && c.getRiskLevel() == RiskLevel.HIGH)
                    .count();

            int percentage = totalStudents > 0 ? (int) ((highRiskCount * 100) / totalStudents) : 0;

            boolean hasUrl = psychologist.getBookingUrl() != null && !psychologist.getBookingUrl().isBlank();

            return PsychologistStatsResponse.builder()
                    .totalStudents(totalStudents)
                    .riskGroupCount(highRiskCount)
                    .riskPercentage(percentage)
                    .activeToday(activeToday)
                    .hasBookingUrl(hasUrl)
                    .build();
        } catch (Exception e) {
            return PsychologistStatsResponse.builder()
                    .totalStudents(0L)
                    .riskGroupCount(0L)
                    .riskPercentage(0)
                    .activeToday(0L)
                    .hasBookingUrl(false)
                    .build();
        }
    }

    public Page<StudentListItemResponse> getStudentsList(String filter, Pageable pageable) {
        Long tenantId = TenantContext.getTenantId();
        String safeFilter = (filter == null || filter.isBlank()) ? "" : filter;

        List<CheckIn> allCheckIns = checkInRepository.findAllByTenantId(tenantId);

        Map<Long, CheckIn> latestCheckInsByUser = allCheckIns.stream()
                .filter(c -> c.getUser() != null)
                .collect(Collectors.groupingBy(
                        c -> c.getUser().getId(),
                        Collectors.collectingAndThen(
                                Collectors.maxBy(Comparator.comparing(c -> c.getCreatedAt())),
                                opt -> opt.orElse(null)
                        )
                ));

        org.springframework.data.domain.Pageable cleanPageable = org.springframework.data.domain.PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                org.springframework.data.domain.Sort.by("username").ascending()
        );
        
        Page<User> pagedStudents;
        if (safeFilter.isEmpty()) {
            pagedStudents = userRepository.findAllByTenantIdAndRole(tenantId, Role.STUDENT, cleanPageable);
        } else {
            List<User> allStudents = userRepository.findAllByTenantIdAndRole(tenantId, Role.STUDENT);
            List<User> filteredStudents = allStudents.stream()
                    .filter(student -> student.getUsername().toLowerCase().contains(safeFilter.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
            
            int start = (int) cleanPageable.getOffset();
            int end = Math.min(start + cleanPageable.getPageSize(), filteredStudents.size());
            List<User> pageContent = filteredStudents.subList(start, end);
            
            pagedStudents = new org.springframework.data.domain.PageImpl<>(pageContent, cleanPageable, filteredStudents.size());
        }

        return pagedStudents.map(student -> {
            CheckIn latestCheckIn = latestCheckInsByUser.get(student.getId());
            
            String riskLevel = "GREEN";
            Integer riskScore = 0;
            java.time.LocalDateTime lastCheckInAt = null;
            boolean hasSos = false;
            
            if (latestCheckIn != null) {
                riskLevel = latestCheckIn.getRiskLevel() != null ? latestCheckIn.getRiskLevel().name() : "GREEN";
                riskScore = latestCheckIn.getTotalScore() != null ? latestCheckIn.getTotalScore() : 0;
                lastCheckInAt = latestCheckIn.getCreatedAt();
                hasSos = latestCheckIn.getRiskLevel() == RiskLevel.RED;
            }
            
            return StudentListItemResponse.builder()
                    .studentId(student.getId())
                    .displayName(student.getUsername())
                    .riskLevel(riskLevel)
                    .riskScore(riskScore)
                    .lastCheckInAt(lastCheckInAt)
                    .hasSos(hasSos)
                    .build();
        });
    }

    public StudentDetailResponse getStudentDetails(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("error.student.notfound"));
        
        if (!student.getTenant().getId().equals(TenantContext.getTenantId())) {
            throw new AccessDeniedException("error.student.access_denied");
        }

        businessMetricsService.incrementCaseOpened();

        return StudentDetailResponse.builder()
                .id(student.getId())
                .anonymousId(student.getUsername())
                .groupName(student.getGroup() != null ? student.getGroup().getName() : "Без группы")
                .build();
    }

    public Page<CheckInHistoryResponse> getStudentHistory(Long studentId, Pageable pageable) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("error.student.notfound"));

        if (!student.getTenant().getId().equals(TenantContext.getTenantId())) {
            throw new AccessDeniedException("error.student.access_denied");
        }

        Page<CheckIn> historyPage = checkInRepository.findAllByUserIdOrderByCreatedAtDesc(studentId, pageable);

        return historyPage.map(ch -> CheckInHistoryResponse.builder()
                .checkInId(ch.getId())
                .date(ch.getCreatedAt())
                .score(ch.getTotalScore())
                .riskLevel(ch.getRiskLevel().name())
                .answersJson(ch.getAnswers())
                .build());
    }

    private Map<Long, CheckIn> getLatestCheckInsMap(Long tenantId) {
        try {
            List<CheckIn> allCheckIns = checkInRepository.findAllByTenantId(tenantId);

            Map<Long, CheckIn> latestCheckInsByUser = allCheckIns.stream()
                    .filter(c -> c != null && c.getUser() != null)
                    .collect(Collectors.groupingBy(
                            c -> c.getUser().getId(),
                            Collectors.collectingAndThen(
                                    Collectors.maxBy(Comparator.comparing(c -> c.getCreatedAt())),
                                    opt -> opt.orElse(null)
                            )
                    ));

            return latestCheckInsByUser;
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    @Transactional
    public void updateBookingUrl(User psychologist, String newUrl) {
        User userToUpdate = userRepository.findById(psychologist.getId())
                .orElseThrow(() -> new ResourceNotFoundException("error.booking.psychologist.notfound"));

        userToUpdate.setBookingUrl(newUrl);
        userRepository.save(userToUpdate);
    }
}