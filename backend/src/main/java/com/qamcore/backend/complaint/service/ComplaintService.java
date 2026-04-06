package com.qamcore.backend.complaint.service;

import com.qamcore.backend.common.exception.AccessDeniedException;
import com.qamcore.backend.common.exception.BusinessValidationException;
import com.qamcore.backend.common.exception.ResourceNotFoundException;
import com.qamcore.backend.common.metrics.BusinessMetricsService;
import com.qamcore.backend.common.service.RateLimiterService;
import com.qamcore.backend.complaint.dto.request.ComplaintRequest;
import com.qamcore.backend.complaint.dto.request.ResolveComplaintRequest;
import com.qamcore.backend.complaint.dto.response.ComplaintResponse;
import com.qamcore.backend.complaint.model.Complaint;
import com.qamcore.backend.complaint.model.ComplaintCategory;
import com.qamcore.backend.complaint.model.ComplaintStatus;
import com.qamcore.backend.complaint.repository.ComplaintRepository;
import com.qamcore.backend.iam.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final BusinessMetricsService metricsService;
    private final RateLimiterService rateLimiterService;

    @Transactional
    public void submitComplaint(User anonymousStudent, ComplaintRequest request) {
        boolean isAllowed = rateLimiterService.isAllowedToday(anonymousStudent.getId(), "complaint", 2);
        if (!isAllowed) {
            throw new BusinessValidationException("error.limit.exceeded");
        }

        Complaint complaint = Complaint.builder()
                .tenantId(anonymousStudent.getTenant().getId())
                .category(request.getCategory())
                .text(request.getText())
                .location(request.getLocation())
                .status(ComplaintStatus.NEW)
                .build();
        complaintRepository.save(complaint);

        metricsService.incrementComplaintSubmitted(
                request.getCategory().name(),
                anonymousStudent.getTenant().getId()
        );
    }

    @Transactional
    public void resolveComplaint(Long complaintId, ResolveComplaintRequest request, User staff) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("error.complaint.notfound"));

        if (!complaint.getTenantId().equals(staff.getTenant().getId())) {
            throw new AccessDeniedException("error.complaint.access_denied");
        }

        complaint.setStatus(request.getStatus());
        complaint.setResolutionComment(request.getResolutionComment());

        if (request.getStatus().name().startsWith("RESOLVED")) {
            complaint.setResolvedAt(LocalDateTime.now());

            metricsService.incrementComplaintResolved(
                    request.getStatus().name(),
                    staff.getTenant().getId()
            );
        }

        complaintRepository.save(complaint);
    }

    @Transactional
    public ComplaintResponse getComplaintDetails(Long complaintId, User staff) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("error.complaint.notfound"));

        if (!complaint.getTenantId().equals(staff.getTenant().getId())) {
            throw new AccessDeniedException("error.complaint.access_denied");
        }

        if (complaint.getStatus() == ComplaintStatus.NEW) {
            complaint.setStatus(ComplaintStatus.IN_PROGRESS);
            complaintRepository.save(complaint);

            metricsService.incrementComplaintInProgress(staff.getTenant().getId());
        }

        return mapToDto(complaint);
    }

    public Page<ComplaintResponse> getFilteredComplaints(User psychologist, ComplaintCategory category, Boolean isResolved, Pageable pageable) {
        List<ComplaintCategory> targetCategories;
        if (category != null) {
            targetCategories = List.of(category);
        } else {
            targetCategories = List.of(ComplaintCategory.values());
        }

        List<ComplaintStatus> targetStatuses;
        if (isResolved == null) {
            targetStatuses = List.of(ComplaintStatus.values());
        } else if (isResolved) {
            targetStatuses = List.of(
                    ComplaintStatus.RESOLVED_SUCCESS,
                    ComplaintStatus.RESOLVED_REJECTED,
                    ComplaintStatus.RESOLVED_SPAM
            );
        } else {
            targetStatuses = List.of(
                    ComplaintStatus.NEW,
                    ComplaintStatus.IN_PROGRESS
            );
        }

        return complaintRepository.findAllByTenantIdAndCategoryInAndStatusInOrderByCreatedAtDesc(
                psychologist.getTenant().getId(),
                targetCategories,
                targetStatuses,
                pageable
        ).map(this::mapToDto);
    }

//    public Page<Complaint> getComplaintsForAdmin(User admin, Pageable pageable) {
//        return complaintRepository.findAllByTenantIdAndCategoryInOrderByCreatedAtDesc(
//                admin.getTenant().getId(),
//                List.of(ComplaintCategory.TEACHER, ComplaintCategory.INFRASTRUCTURE, ComplaintCategory.OTHER),
//                pageable
//        );
//    }

    private ComplaintResponse mapToDto(Complaint complaint) {
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .category(complaint.getCategory().name())
                .status(complaint.getStatus().name())
                .text(complaint.getText())
                .location(complaint.getLocation())
                .resolutionComment(complaint.getResolutionComment())
                .createdAt(complaint.getCreatedAt())
                .resolvedAt(complaint.getResolvedAt())
                .build();
    }
}
