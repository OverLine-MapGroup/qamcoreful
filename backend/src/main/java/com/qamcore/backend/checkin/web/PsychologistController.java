package com.qamcore.backend.checkin.web;

import com.qamcore.backend.checkin.dto.request.OpenCaseRequest;
import com.qamcore.backend.checkin.dto.request.UpdateBookingUrlRequest;
import com.qamcore.backend.checkin.dto.response.*;
import com.qamcore.backend.checkin.service.PsychologistService;
import com.qamcore.backend.checkin.service.StudentCaseService;
import com.qamcore.backend.complaint.dto.request.ResolveComplaintRequest;
import com.qamcore.backend.complaint.dto.response.ComplaintResponse;
import com.qamcore.backend.complaint.model.Complaint;
import com.qamcore.backend.complaint.model.ComplaintCategory;
import com.qamcore.backend.complaint.service.ComplaintService;
import com.qamcore.backend.iam.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/psychologist")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_PSYCHOLOGIST')")
public class PsychologistController {
    private final PsychologistService psychologistService;
    private final StudentCaseService caseService;
    private final ComplaintService complaintService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<PsychologistStatsResponse> getDashboardStats(
            @AuthenticationPrincipal User psychologist) {
        return ResponseEntity.ok(psychologistService.getDashboardStats(psychologist));
    }

    @GetMapping("/students")
    public ResponseEntity<Page<StudentListItemResponse>> getStudentsList(
            @RequestParam(required = false) String filter,
            @PageableDefault(size = 20, sort = "total_score", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(psychologistService.getStudentsList(filter, pageable));
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<StudentDetailResponse> getStudentDetails(@PathVariable Long studentId) {
        return ResponseEntity.ok(psychologistService.getStudentDetails(studentId));
    }

    @GetMapping("/students/{studentId}/history")
    public ResponseEntity<Page<CheckInHistoryResponse>> getStudentHistory(
            @PathVariable Long studentId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(psychologistService.getStudentHistory(studentId, pageable));
    }

    @PostMapping("/students/{studentId}/cases")
    public ResponseEntity<StudentCaseResponse> openCase(
            @PathVariable Long studentId,
            @RequestBody @Valid OpenCaseRequest request,
            @AuthenticationPrincipal User psychologist) {
        return ResponseEntity.ok(caseService.openCase(studentId, psychologist, request));
    }

    @PostMapping("/cases/{caseId}/resolve")
    public ResponseEntity<Void> resolveCase(
            @PathVariable Long caseId,
            @AuthenticationPrincipal User psychologist) {
        caseService.resolveCase(caseId, psychologist);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cases/active")
    public ResponseEntity<List<StudentCaseResponse>> getActiveCases(
            @AuthenticationPrincipal User psychologist) {
        return ResponseEntity.ok(caseService.getActiveCasesForPsychologist(psychologist));
    }

    @GetMapping("/students/{studentId}/cases")
    public ResponseEntity<List<StudentCaseResponse>> getStudentCasesHistory(
            @PathVariable Long studentId,
            @AuthenticationPrincipal User psychologist) {
        return ResponseEntity.ok(caseService.getStudentCaseHistory(studentId, psychologist));
    }

    @PatchMapping("/complaints/{complaintId}/resolve")
    public ResponseEntity<Void> resolveComplaint(
            @PathVariable Long complaintId,
            @RequestBody @Valid ResolveComplaintRequest request,
            @AuthenticationPrincipal User staff) {
        complaintService.resolveComplaint(complaintId, request, staff);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/complaints")
    public ResponseEntity<Page<ComplaintResponse>> getComplaints(
            @AuthenticationPrincipal User staff,
            @RequestParam(required = false) ComplaintCategory category,
            @RequestParam(required = false) Boolean isResolved,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(
                complaintService.getFilteredComplaints(staff, category, isResolved, pageable)
        );
    }

    @GetMapping("/complaints/{complaintId}")
    public ResponseEntity<ComplaintResponse> getComplaintDetails(
            @PathVariable Long complaintId,
            @AuthenticationPrincipal User staff) {
        return ResponseEntity.ok(complaintService.getComplaintDetails(complaintId, staff));
    }

    @PatchMapping("/profile/booking-url")
    public ResponseEntity<Void> updateBookingUrl(
            @RequestBody @Valid UpdateBookingUrlRequest request,
            @AuthenticationPrincipal User psychologist) {
        psychologistService.updateBookingUrl(psychologist, request.getBookingUrl());
        return ResponseEntity.ok().build();
    }
}