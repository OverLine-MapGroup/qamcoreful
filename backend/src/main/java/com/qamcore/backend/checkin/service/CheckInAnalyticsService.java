package com.qamcore.backend.checkin.service;

import com.qamcore.backend.checkin.dto.response.GroupDetailedResponse;
import com.qamcore.backend.checkin.dto.response.GroupStatsProjection;
import com.qamcore.backend.checkin.dto.response.GroupStudentItemDto;
import com.qamcore.backend.checkin.model.CheckIn;
import com.qamcore.backend.checkin.model.RiskLevel;
import com.qamcore.backend.checkin.repository.CheckInRepository;
import com.qamcore.backend.common.exception.AccessDeniedException;
import com.qamcore.backend.common.context.TenantContext;
import com.qamcore.backend.common.exception.ResourceNotFoundException;
import com.qamcore.backend.iam.dto.request.ParticipationStatsRequest;
import com.qamcore.backend.iam.dto.request.SchoolAdminDashboardStatsRequest;
import com.qamcore.backend.iam.model.InviteCode;
import com.qamcore.backend.iam.model.Role;
import com.qamcore.backend.iam.model.StudentGroup;
import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.repository.InviteCodeRepository;
import com.qamcore.backend.iam.repository.StudentGroupRepository;
import com.qamcore.backend.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CheckInAnalyticsService {
    private final CheckInRepository checkInRepository;
    private final UserRepository userRepository;
    private final InviteCodeRepository inviteCodeRepository;
    private final StudentGroupRepository groupRepository;

    @Cacheable(
            value = "adminDashboard",
            key = "T(com.qamcore.backend.common.context.TenantContext).getTenantId()"
    )
    public SchoolAdminDashboardStatsRequest getSchoolAdminStats() {
        Long tenantId = TenantContext.getTenantId();

        long totalStudents = userRepository.countByTenantIdAndRole(tenantId, Role.STUDENT);
        long totalPsychologist = userRepository.countByTenantIdAndRole(tenantId, Role.PSYCHOLOGIST);
        long unusedCodes = inviteCodeRepository.countByTenantIdAndUserIsNull(tenantId);

        LocalDateTime startOfWeek = getStartOfWeek();
        long activeStudentsCount = checkInRepository.countActiveToday(tenantId, startOfWeek);

        double rawRate = totalStudents > 0 ? (double) activeStudentsCount / totalStudents * 100 : 0;
        double rate = Math.round(rawRate * 10.0) / 10.0;

        return SchoolAdminDashboardStatsRequest.builder()
                .totalStudents(totalStudents)
                .totalPsychologist(totalPsychologist)
                .unusedCodesCount(unusedCodes)
                .weeklyParticipationRate(rate)
                .build();
    }

    @Cacheable(
            value = "groupParticipation",
            key = "T(com.qamcore.backend.common.context.TenantContext).getTenantId()"
    )
    // Таблица активности по группам. Показывает, в каких группах студенты проходят тесты, а в каких нет.
    public List<ParticipationStatsRequest> getGroupParticipationStats() {
        Long tenantId = TenantContext.getTenantId();
        LocalDateTime startOfWeek = getStartOfWeek();

        List<GroupStatsProjection> stats = groupRepository.getGroupStats(tenantId, startOfWeek);

        List<ParticipationStatsRequest> result = stats.stream().map(stat -> {
            int total = stat.getTotalStudents() != null ? stat.getTotalStudents() : 0;
            int active = stat.getActiveStudents() != null ? stat.getActiveStudents() : 0;
            long unused = stat.getUnusedCodes() != null ? stat.getUnusedCodes() : 0L;

            double percentage = total == 0 ? 0 : (double) active / total * 100;

            return ParticipationStatsRequest.builder()
                    .groupId(stat.getGroupId())
                    .groupName(stat.getGroupName())
                    .totalStudents(total)
                    .activeStudents(active)
                    .participationPercentage(percentage)
                    .unusedCodes(unused)
                    .build();
        }).collect(Collectors.toList());

        result.sort((a, b) -> Double.compare(a.getParticipationPercentage(), b.getParticipationPercentage()));
        return result;
    }

    private LocalDateTime getStartOfWeek() {
        return LocalDate.now(ZoneId.of("Asia/Almaty"))
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atStartOfDay();
    }

    @Cacheable(
            value = "groupDetails",
            key = "T(com.qamcore.backend.common.context.TenantContext).getTenantId() + ':' + #groupId"
    )
    public GroupDetailedResponse getGroupDetails(Long groupId) {
        Long tenantId = TenantContext.getTenantId();
        StudentGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("error.group.notfound"));

        if (!group.getTenant().getId().equals(tenantId)) {
            throw new AccessDeniedException("error.group.access_denied.other_school");
        }

        List<User> students = userRepository.findAllByGroupId(groupId);
        long unusedCodes = inviteCodeRepository.countByGroupIdAndUserIsNull(groupId);

        List<Long> studentIds = students.stream().map(User::getId).collect(Collectors.toList());

        List<CheckIn> latestCheckIns = studentIds.isEmpty() ? Collections.emptyList()
                : checkInRepository.findLatestCheckInsByUserIds(studentIds);

        Map<Long, CheckIn> latestCheckInMap = latestCheckIns.stream()
                .collect(Collectors.toMap(c -> c.getUser().getId(), Function.identity()));

        long red = 0, yellow = 0, green = 0, activeThisWeek = 0;
        LocalDateTime startOfWeek = getStartOfWeek();
        List<GroupStudentItemDto> studentDtos = new ArrayList<>();

        for (User s : students) {
            CheckIn last = latestCheckInMap.get(s.getId());

            if (last != null) {
                if (last.getRiskLevel() == RiskLevel.RED) red++;
                else if (last.getRiskLevel() == RiskLevel.MEDIUM) yellow++;
                else if (last.getRiskLevel() == RiskLevel.LOW) green++;

                if (last.getCreatedAt().isAfter(startOfWeek)) {
                    activeThisWeek++;
                }
            }

            studentDtos.add(GroupStudentItemDto.builder()
                    .studentId(s.getId())
                    .displayName(s.getUsername())
                    .lastRiskLevel(last != null ? last.getRiskLevel().name() : "NONE")
                    .lastScore(last != null ? last.getTotalScore() : 0)
                    .lastCheckInAt(last != null ? last.getCreatedAt() : null)
                    .build());
        }

        double participationRate = students.isEmpty() ? 0 : (double) activeThisWeek / students.size() * 100;

        return GroupDetailedResponse.builder()
                .groupId(group.getId())
                .groupName(group.getName())
                .totalStudents(students.size())
                .unusedCodesCount(unusedCodes)
                .participationRate(participationRate)
                .redRiskCount(red)
                .yellowRiskCount(yellow)
                .greenRiskCount(green)
                .students(studentDtos)
                .build();
    }
}