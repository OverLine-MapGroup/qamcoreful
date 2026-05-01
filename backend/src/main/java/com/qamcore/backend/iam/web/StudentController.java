package com.qamcore.backend.iam.web;

import com.qamcore.backend.checkin.dto.response.PsychologistBookingResponse;
import com.qamcore.backend.checkin.dto.response.StudentCaseResponse;
import com.qamcore.backend.checkin.service.BookingEventService;
import com.qamcore.backend.checkin.service.StudentCaseService;
import com.qamcore.backend.common.metrics.BusinessMetricsService;
import com.qamcore.backend.complaint.dto.request.ComplaintRequest;
import com.qamcore.backend.complaint.service.ComplaintService;
import com.qamcore.backend.iam.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {
    private final StudentCaseService caseService;
    private final ComplaintService complaintService;
    private final BookingEventService bookingEventService;
    private final BusinessMetricsService businessMetricsService;

    @GetMapping("/cases/active")
    public ResponseEntity<StudentCaseResponse> getActiveCase(@AuthenticationPrincipal User student) {
        List<StudentCaseResponse> activeCases = caseService.getActiveCasesForStudent(student);
        if (activeCases.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(activeCases.get(0));
    }

    @GetMapping("/messages")
    public ResponseEntity<List<StudentCaseResponse>> getMyMessages(@AuthenticationPrincipal User student) {
        return ResponseEntity.ok(caseService.getActiveCasesForStudent(student));
    }

    @PostMapping("/complaints")
    public ResponseEntity<Void> submitComplaint(
            @RequestBody @Valid ComplaintRequest request,
            @AuthenticationPrincipal User student) {
        complaintService.submitComplaint(student, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/psychologists")
    public ResponseEntity<List<PsychologistBookingResponse>> getAvailablePsychologists(
            @AuthenticationPrincipal User student) {
        return ResponseEntity.ok(bookingEventService.getAvailablePsychologists(student));
    }

    @PostMapping("/psychologists/{psychologistId}/book-click")
    public ResponseEntity<Void> logBookingClick(
            @PathVariable Long psychologistId,
            @AuthenticationPrincipal User student) {
        bookingEventService.logBookingClick(student, psychologistId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sos")
    public ResponseEntity<Void> triggerSosButton(@AuthenticationPrincipal User student) {
        businessMetricsService.incrementSosButtonClicked(student.getTenant().getId());
        return ResponseEntity.ok().build();
    }
}