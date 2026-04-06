package com.qamcore.backend.checkin.model;

import com.qamcore.backend.common.model.BaseEntity;
import com.qamcore.backend.iam.model.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "booking_events", indexes = {
        @Index(name = "idx_booking_events_tenant", columnList = "tenant_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class BookingEvent extends BaseEntity {
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
}