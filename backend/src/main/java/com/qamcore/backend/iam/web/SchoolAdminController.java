package com.qamcore.backend.iam.web;

import com.qamcore.backend.checkin.dto.response.GroupDetailedResponse;
import com.qamcore.backend.checkin.service.CheckInAnalyticsService;
import com.qamcore.backend.complaint.dto.request.ComplaintRequest;
import com.qamcore.backend.complaint.dto.request.ResolveComplaintRequest;
import com.qamcore.backend.complaint.model.Complaint;
import com.qamcore.backend.complaint.service.ComplaintService;
import com.qamcore.backend.iam.dto.request.*;
import com.qamcore.backend.iam.dto.response.GroupResponse;
import com.qamcore.backend.iam.dto.response.StaffListItemResponse;
import com.qamcore.backend.iam.dto.response.StaffResponse;
import com.qamcore.backend.iam.dto.response.TeacherResponse;
import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.service.InviteCodeService;
import com.qamcore.backend.iam.service.StudentGroupService;
import com.qamcore.backend.iam.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/school-admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SCHOOL_ADMIN')")
public class SchoolAdminController {
    private final UserService userService;
    private final StudentGroupService groupService;
    private final InviteCodeService inviteCodeService;
    private final CheckInAnalyticsService analyticsService;
    private final ComplaintService complaintService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<SchoolAdminDashboardStatsRequest> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getSchoolAdminStats());
    }

    @GetMapping("/analytics/participation")
    public ResponseEntity<List<ParticipationStatsRequest>> getGroupParticipationStats() {
        return ResponseEntity.ok(analyticsService.getGroupParticipationStats());
    }

    @PostMapping("/staff")
    public ResponseEntity<StaffResponse> createStaff(@RequestBody @Valid CreateStaffRequest request) {
        return ResponseEntity.ok(userService.createStaff(request));
    }

    @GetMapping("/staff")
    public ResponseEntity<List<StaffListItemResponse>> getAllStaff() {
        return ResponseEntity.ok(userService.getAllPsychologists());
    }

    @PostMapping("/groups")
    public ResponseEntity<GroupResponse> createGroup(@RequestBody @Valid CreateGroupRequest request) {
        return ResponseEntity.ok(groupService.createGroup(request));
    }

    @GetMapping("/groups")
    public ResponseEntity<List<GroupResponse>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @PostMapping("/codes/generate")
    public ResponseEntity<List<String>> generateCodes(@RequestBody @Valid GenerateCodesRequest request) {
        return ResponseEntity.ok(inviteCodeService.generateBulkCodes(request));
    }

    @GetMapping("/groups/{groupId}/unused-codes")
    public ResponseEntity<List<String>> getUnusedCodes(@PathVariable Long groupId) {
        return ResponseEntity.ok(inviteCodeService.getUnusedCodesByGroup(groupId));
    }

    @GetMapping("/groups/{groupId}/details")
    public ResponseEntity<GroupDetailedResponse> getGroupDetails(@PathVariable Long groupId) {
        return ResponseEntity.ok(analyticsService.getGroupDetails(groupId));
    }

//    @PatchMapping("/complaints/{complaintId}/resolve")
//    public ResponseEntity<Void> resolveComplaint(
//            @PathVariable Long complaintId,
//            @RequestBody @Valid ResolveComplaintRequest request,
//            @AuthenticationPrincipal User staff) {
//        complaintService.resolveComplaint(complaintId, request, staff);
//        return ResponseEntity.noContent().build();
//    }
//
//    @GetMapping("/complaints")
//    public ResponseEntity<Page<Complaint>> getComplaints(
//            @AuthenticationPrincipal User staff,
//            @PageableDefault(size = 20) Pageable pageable) {
//        return ResponseEntity.ok(complaintService.getComplaintsForAdmin(staff, pageable));
//    }
}