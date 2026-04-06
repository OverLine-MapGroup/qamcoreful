package com.qamcore.backend.checkin.model;

import com.qamcore.backend.common.model.BaseEntity;
import com.qamcore.backend.iam.model.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_cases", indexes = {
        @Index(name = "idx_student_cases_student_status", columnList = "student_id, status"),
        @Index(name = "idx_student_cases_tenant", columnList = "tenant_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class StudentCase extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "psychologist_id", nullable = false)
    private User psychologist;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStatus status;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String introMessage;

    @Column(nullable = false)
    private String communicationLink;
    private LocalDateTime resolvedAt;
}