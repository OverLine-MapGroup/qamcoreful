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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PsychologistService {
    private final CheckInRepository checkInRepository;
    private final UserRepository userRepository;
    private final BusinessMetricsService businessMetricsService;

    public PsychologistStatsResponse getDashboardStats(User psychologist) {
        Long tenantId = psychologist.getTenant().getId();
        long totalStudents = userRepository.countByTenantIdAndRole(tenantId, Role.STUDENT);
        long activeToday = checkInRepository.countActiveToday(tenantId, LocalDate.now().atStartOfDay());

        Map<Long, CheckIn> latestCheckIns = getLatestCheckInsMap(tenantId);
        long redCount = latestCheckIns.values().stream()
                .filter(c -> c.getRiskLevel() == RiskLevel.RED)
                .count();

        int percentage = totalStudents > 0 ? (int) ((redCount * 100) / totalStudents) : 0;

        boolean hasUrl = psychologist.getBookingUrl() != null && !psychologist.getBookingUrl().isBlank();

        return PsychologistStatsResponse.builder()
                .totalStudents(totalStudents)
                .riskGroupCount(redCount)
                .riskPercentage(percentage)
                .activeToday(activeToday)
                .hasBookingUrl(hasUrl)
                .build();
    }

    public Page<StudentListItemResponse> getStudentsList(String filter, Pageable pageable) {
        Long tenantId = TenantContext.getTenantId();
        String safeFilter = (filter == null || filter.isBlank()) ? "" : filter;
        Page<CheckIn> pagedCheckIns = checkInRepository.findLatestCheckInsPaged(tenantId, safeFilter, pageable);

        return pagedCheckIns.map(checkIn -> StudentListItemResponse.builder()
                .studentId(checkIn.getUser().getId())
                .displayName(checkIn.getUser().getUsername())
                .riskLevel(checkIn.getRiskLevel().name())
                .riskScore(checkIn.getTotalScore())
                .lastCheckInAt(checkIn.getCreatedAt())
                .hasSos(checkIn.getRiskLevel() == RiskLevel.RED)
                .build());
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
        List<CheckIn> latestCheckIns = checkInRepository.findLatestCheckInsByTenant(tenantId);

        return latestCheckIns.stream()
                .collect(Collectors.toMap(
                        c -> c.getUser().getId(),
                        Function.identity()
                ));
    }

    @Transactional
    public void updateBookingUrl(User psychologist, String newUrl) {
        User userToUpdate = userRepository.findById(psychologist.getId())
                .orElseThrow(() -> new ResourceNotFoundException("error.booking.psychologist.notfound"));

        userToUpdate.setBookingUrl(newUrl);
        userRepository.save(userToUpdate);
    }
}