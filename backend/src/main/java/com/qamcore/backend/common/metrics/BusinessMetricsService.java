package com.qamcore.backend.common.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
public class BusinessMetricsService {
    private final Counter checkinCompletedCounter;
    private final Counter caseOpenedCounter;
    private final Counter studentContactedCounter;
    private final Counter caseResolvedCounter;
    private final MeterRegistry meterRegistry;

    public BusinessMetricsService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;

        this.checkinCompletedCounter = Counter.builder("qamcore_checkin_completed_total")
                .description("Total number of completed check-ins")
                .register(meterRegistry);

        this.caseOpenedCounter = Counter.builder("qamcore_case_opened_total")
                .description("Total number of psychologist cases opened")
                .register(meterRegistry);

        this.studentContactedCounter = Counter.builder("qamcore_student_contacted_total")
                .description("Total number of students contacted by psychologist")
                .register(meterRegistry);

        this.caseResolvedCounter = Counter.builder("qamcore_case_resolved_total")
                .description("Total number of resolved cases")
                .register(meterRegistry);
    }

    public void incrementLogin(String role, Long tenantId) {
        Counter.builder("qamcore_auth_login_total")
                .description("Total number of successful logins")
                .tag("role", role)
                .tag("tenant", tenantId != null ? tenantId.toString() : "UNKNOWN")
                .register(meterRegistry)
                .increment();
    }

    public void incrementInviteCodeActivated(Long tenantId, Long groupId) {
        Counter.builder("qamcore_invite_code_activated_total")
                .description("Total number of activated invite codes")
                .tag("tenant", tenantId.toString())
                .tag("group", groupId != null ? groupId.toString() : "NONE")
                .register(meterRegistry)
                .increment();
    }

    public void incrementBookingClicked(Long tenantId) {
        Counter.builder("qamcore_psychologist_booking_clicked_total")
                .description("Total number of times students clicked Book Appointment")
                .tag("tenant", tenantId.toString())
                .register(meterRegistry)
                .increment();
    }

    public void incrementCheckinCompleted() { checkinCompletedCounter.increment(); }

    public void incrementCaseOpened() { caseOpenedCounter.increment(); }

    public void incrementStudentContacted() { studentContactedCounter.increment(); }

    public void incrementCaseResolved() { caseResolvedCounter.increment(); }

    public void recordRiskDetected(String riskLevel, Long tenantId) {
        Counter.builder("qamcore_risk_detected_total")
                .description("Number of risks detected by level")
                .tag("level", riskLevel)
                .tag("tenant", tenantId.toString())
                .register(meterRegistry)
                .increment();
    }

    public void incrementComplaintSubmitted(String category, Long tenantId) {
        Counter.builder("qamcore_complaint_submitted_total")
                .description("Total anonymous complaints submitted")
                .tag("category", category)
                .tag("tenant", tenantId.toString())
                .register(meterRegistry)
                .increment();
    }

    public void incrementComplaintResolved(String status, Long tenantId) {
        Counter.builder("qamcore_complaint_resolved_total")
                .description("Total complaints resolved by staff")
                .tag("status", status)
                .tag("tenant", tenantId.toString())
                .register(meterRegistry)
                .increment();
    }

    public void incrementComplaintInProgress(Long tenantId) {
        Counter.builder("qamcore_complaint_in_progress_total")
                .description("Total complaints moved to IN_PROGRESS")
                .tag("tenant", tenantId.toString())
                .register(meterRegistry)
                .increment();
    }

    public void incrementSosButtonClicked(Long tenantId) {
        Counter.builder("qamcore_sos_button_clicked_total")
                .description("Total times the SOS emergency button was clicked")
                .tag("tenant", tenantId.toString())
                .register(meterRegistry)
                .increment();
    }
}