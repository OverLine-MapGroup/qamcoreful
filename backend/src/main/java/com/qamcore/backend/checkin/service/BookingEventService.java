package com.qamcore.backend.checkin.service;

import com.qamcore.backend.common.exception.AccessDeniedException;
import com.qamcore.backend.common.exception.ResourceNotFoundException;
import com.qamcore.backend.checkin.dto.response.PsychologistBookingResponse;
import com.qamcore.backend.checkin.model.BookingEvent;
import com.qamcore.backend.checkin.repository.BookingEventRepository;
import com.qamcore.backend.common.metrics.BusinessMetricsService;
import com.qamcore.backend.iam.model.Role;
import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingEventService {
    private final BookingEventRepository bookingEventRepository;
    private final UserRepository userRepository;
    private final BusinessMetricsService metricsService;

    public List<PsychologistBookingResponse> getAvailablePsychologists(User student) {
        List<User> psychologists = userRepository.findAllByTenantIdAndRole(
                student.getTenant().getId(),
                Role.PSYCHOLOGIST
        );

        return psychologists.stream()
                .filter(p -> p.getBookingUrl() != null && !p.getBookingUrl().isBlank())
                .map(p -> PsychologistBookingResponse.builder()
                        .psychologistId(p.getId())
                        .name(p.getUsername())
                        .bookingUrl(p.getBookingUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void logBookingClick(User student, Long psychologistId) {
        User psychologist = userRepository.findById(psychologistId)
                .orElseThrow(() -> new ResourceNotFoundException("error.booking.psychologist.notfound"));

        if (!psychologist.getTenant().getId().equals(student.getTenant().getId())) {
            throw new AccessDeniedException("error.booking.access_denied");
        }

        BookingEvent event = BookingEvent.builder()
                .student(student)
                .psychologist(psychologist)
                .tenantId(student.getTenant().getId())
                .build();

        bookingEventRepository.save(event);

        metricsService.incrementBookingClicked(student.getTenant().getId());
    }
}