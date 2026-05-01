package com.qamcore.backend.checkin.service;

import com.qamcore.backend.common.exception.AccessDeniedException;
import com.qamcore.backend.common.exception.BusinessValidationException;
import com.qamcore.backend.common.exception.ResourceNotFoundException;
import com.qamcore.backend.checkin.dto.request.OpenCaseRequest;
import com.qamcore.backend.checkin.dto.response.StudentCaseResponse;
import com.qamcore.backend.checkin.model.CaseStatus;
import com.qamcore.backend.checkin.model.StudentCase;
import com.qamcore.backend.checkin.repository.StudentCaseRepository;
import com.qamcore.backend.common.metrics.BusinessMetricsService;
import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentCaseService {
    private final StudentCaseRepository caseRepository;
    private final UserRepository userRepository;
    private final BusinessMetricsService metricsService;
    private final RedisTemplate<String, Object> redisTemplate;

    @Transactional
    public StudentCaseResponse openCase(Long studentId, User psychologist, OpenCaseRequest request) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("error.student.case.student.notfound"));

        if (!student.getTenant().getId().equals(psychologist.getTenant().getId())) {
            throw new AccessDeniedException("error.student.case.access_denied.other_school");
        }

        StudentCase existingCase = caseRepository.findByStudentIdAndStatus(studentId, CaseStatus.OPEN);
        
        if (existingCase != null) {
            // Update existing case with new message and timestamp
            existingCase.setIntroMessage(request.getMessage());
            existingCase.setCommunicationLink(request.getCommunicationLink());
            existingCase.setUpdatedAt(LocalDateTime.now());
            
            existingCase = caseRepository.save(existingCase);
            
            // Publish real-time notification to student about case update
            String channelName = "student:" + studentId + ":notifications";
            redisTemplate.convertAndSend(channelName, mapToResponse(existingCase));
            
            return mapToResponse(existingCase);
        } else {
            // Create new case
            StudentCase newCase = StudentCase.builder()
                    .student(student)
                    .psychologist(psychologist)
                    .tenantId(student.getTenant().getId())
                    .status(CaseStatus.OPEN)
                    .introMessage(request.getMessage())
                    .communicationLink(request.getCommunicationLink())
                    .build();

            newCase = caseRepository.save(newCase);

            metricsService.incrementStudentContacted();

            // Publish real-time notification to student about new case
            String channelName = "student:" + studentId + ":notifications";
            redisTemplate.convertAndSend(channelName, mapToResponse(newCase));

            return mapToResponse(newCase);
        }
    }

    @Transactional
    public void resolveCase(Long caseId, User psychologist) {
        StudentCase studentCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("error.student.case.notfound"));

        if (!studentCase.getTenantId().equals(psychologist.getTenant().getId())) {
            throw new AccessDeniedException("error.student.case.access_denied");
        }

        studentCase.setStatus(CaseStatus.RESOLVED);
        studentCase.setResolvedAt(LocalDateTime.now());
        caseRepository.save(studentCase);

        metricsService.incrementCaseResolved();
    }

    public List<StudentCaseResponse> getStudentCaseHistory(Long studentId, User psychologist) {
        return caseRepository.findAllByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<StudentCaseResponse> getActiveCasesForStudent(User student) {
        return caseRepository.findAllByStudentIdAndStatusOrderByCreatedAtDesc(student.getId(), CaseStatus.OPEN).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<StudentCaseResponse> getActiveCasesForPsychologist(User psychologist) {
        return caseRepository.findAllByPsychologistIdAndStatusOrderByCreatedAtDesc(psychologist.getId(), CaseStatus.OPEN).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private StudentCaseResponse mapToResponse(StudentCase c) {
        return StudentCaseResponse.builder()
                .caseId(c.getId())
                .psychologistName(c.getPsychologist().getUsername())
                .message(c.getIntroMessage())
                .communicationLink(c.getCommunicationLink())
                .status(c.getStatus().name())
                .createdAt(c.getCreatedAt())
                .resolvedAt(c.getResolvedAt())
                .build();
    }
}