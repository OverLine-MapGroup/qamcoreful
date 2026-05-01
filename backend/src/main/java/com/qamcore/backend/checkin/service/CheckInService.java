package com.qamcore.backend.checkin.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qamcore.backend.common.exception.BusinessValidationException;
import com.qamcore.backend.checkin.dto.request.CheckInResultRequest;
import com.qamcore.backend.checkin.dto.response.ActiveCheckInResponse;
import com.qamcore.backend.checkin.dto.response.CheckInResultResponse;
import com.qamcore.backend.checkin.model.CheckIn;
import com.qamcore.backend.checkin.model.RiskLevel;
import com.qamcore.backend.checkin.repository.CheckInRepository;
import com.qamcore.backend.common.metrics.BusinessMetricsService;
import com.qamcore.backend.iam.model.User;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.qamcore.backend.checkin.model.CheckInStatus;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CheckInService {
    private final CheckInRepository checkInRepository;
    private final CheckInConfig config;
    private final ObjectMapper objectMapper;
    private final BusinessMetricsService businessMetricsService;
    private static final ZoneId ZONE_ID = ZoneId.of("Asia/Almaty");

    public ActiveCheckInResponse getActiveCheckIn(User user) {
        if (user == null) {
            throw new BusinessValidationException("error.user.not.authenticated");
        }
        
        System.out.println("DEBUG: getActiveCheckIn called with user: " + (user != null ? user.getUsername() : "null"));
        
        String version = config.getCurrentVersion();

        LocalDateTime startOfWeek = LocalDate.now(ZONE_ID)
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atStartOfDay();

        LocalDateTime endOfWeek = LocalDate.now(ZONE_ID)
                .with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
                .atTime(23, 59, 59);

        boolean isCompleted = checkInRepository.existsByUserAndVersionAndDate(
                user, version, startOfWeek
        );

        if (isCompleted) {
            return ActiveCheckInResponse.builder()
                    .checkInId(version)
                    .status(CheckInStatus.COMPLETED)
                    .message("Спасибо! Вы уже прошли опрос на этой неделе. Следующий откроется в понедельник.")
                    .deadline(endOfWeek)
                    .questions(null)
                    .build();
        }

        return ActiveCheckInResponse.builder()
                .checkInId(version)
                .status(CheckInStatus.PENDING)
                .deadline(endOfWeek)
                .questions(config.getQuestions())
                .build();
    }

    @Transactional
    @SneakyThrows
    public CheckInResultResponse processSubmission(User user, CheckInResultRequest request) {
        if (user == null) {
            throw new BusinessValidationException("error.user.not.authenticated");
        }
        
        // Ensure tenant is loaded to avoid lazy loading issues
        if (user.getTenant() == null) {
            throw new BusinessValidationException("error.user.not.authenticated");
        }
        
        if (!config.getCurrentVersion().equals(request.getCheckinId())){
            throw new BusinessValidationException("error.checkin.outdated_id");
        }

        LocalDateTime startOfWeek = LocalDate.now(ZONE_ID)
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atStartOfDay();

        if (checkInRepository.existsByUserAndVersionAndDate(user, config.getCurrentVersion(), startOfWeek)) {
            throw new BusinessValidationException("error.checkin.double_submission");
        }

        int totalScore = 0;
        boolean sosTrigger = false;
        Map<String, Integer> answers = request.getAnswers();

        for (Map.Entry<String, Integer> entry : answers.entrySet()) {
            String qId = entry.getKey();
            Integer value = entry.getValue();

            CheckInConfig.Question question = config.getQuestionMap().get(qId);

            if (question == null) {
                throw new BusinessValidationException("error.checkin.question.unknown", qId);
            }

            if (value < question.getMin() || value > question.getMax()) {
                throw new BusinessValidationException("error.checkin.answer.out_of_range", qId);
            }

            totalScore += (value * question.getWeight());

            if (question.isCritical() && value > 0) {
                sosTrigger = true;
            }
        }

        RiskLevel risk = RiskLevel.LOW;
        if (totalScore >= config.getThresholdMedium()) risk = RiskLevel.MEDIUM;
        if (totalScore > config.getThresholdRed()) risk = RiskLevel.RED;
        if (sosTrigger) risk = RiskLevel.RED;

        CheckIn checkIn = CheckIn.builder()
                .user(user)
                .tenantId(user.getTenant().getId())
                .scoringVersion(request.getCheckinId())
                .totalScore(totalScore)
                .riskLevel(risk)
                .answers(objectMapper.writeValueAsString(answers))
                .build();

        checkInRepository.save(checkIn);

        businessMetricsService.incrementCheckinCompleted();
        businessMetricsService.recordRiskDetected(risk.name(), user.getTenant().getId());

        return CheckInResultResponse.builder()
                .status("submitted")
                .build();
    }
}