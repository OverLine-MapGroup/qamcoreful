package com.qamcore.backend.checkin.web;

import com.qamcore.backend.checkin.dto.request.CheckInResultRequest;
import com.qamcore.backend.checkin.dto.response.ActiveCheckInResponse;
import com.qamcore.backend.checkin.dto.response.CheckInResultResponse;
import com.qamcore.backend.checkin.service.CheckInService;
import com.qamcore.backend.iam.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/checkins")
@RequiredArgsConstructor
public class CheckInController {
    private final CheckInService checkInService;

    @GetMapping("/active")
    public ResponseEntity<ActiveCheckInResponse> getActiveCheckIn(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(checkInService.getActiveCheckIn(user));
    }

    @PostMapping
    public ResponseEntity<CheckInResultResponse> submitCheckIn(
            @RequestBody @Valid CheckInResultRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(checkInService.processSubmission(user, request));
    }
}