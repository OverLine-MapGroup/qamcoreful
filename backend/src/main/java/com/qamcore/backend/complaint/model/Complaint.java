package com.qamcore.backend.complaint.model;

import com.qamcore.backend.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints", indexes = {
        @Index(name = "idx_complaints_tenant_category_status", columnList = "tenant_id, category, status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class Complaint extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    @Column(name = "location")
    private String location;

    @Column(columnDefinition = "TEXT")
    private String resolutionComment;

    private LocalDateTime resolvedAt;
}