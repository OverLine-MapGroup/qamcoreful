package com.qamcore.backend.checkin.model;

import com.qamcore.backend.common.model.BaseEntity;
import com.qamcore.backend.iam.model.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "checkins", indexes = {
        @Index(name = "idx_checkin_tenant_date", columnList = "tenant_id, created_at"),
        @Index(name = "idx_checkin_user_date", columnList = "user_id, created_at"),
        @Index(name = "idx_checkin_risk_level", columnList = "riskLevel")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class CheckIn extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "tenant_id")
    private Long tenantId;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private RiskLevel riskLevel;

    @Column(name = "scoring_version", nullable = false)
    private String scoringVersion; // "weekly-v1"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answers;
}