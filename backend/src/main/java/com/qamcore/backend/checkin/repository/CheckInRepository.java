package com.qamcore.backend.checkin.repository;

import com.qamcore.backend.checkin.model.CheckIn;
import com.qamcore.backend.iam.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    @Query("SELECT COUNT(c) > 0 FROM CheckIn c " +
            "WHERE c.user = :user " +
            "AND c.scoringVersion = :version " +
            "AND c.createdAt >= :afterDate")
    boolean existsByUserAndVersionAndDate(
            @Param("user") User user,
            @Param("version") String version,
            @Param("afterDate") LocalDateTime afterDate
    );

    Page<CheckIn> findAllByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<CheckIn> findAllByTenantId(Long tenantId);

    List<CheckIn> findAllByUserIdIn(List<Long> userIds);

    @Query("SELECT count(c) FROM CheckIn c WHERE c.tenantId = :tenantId AND c.createdAt >= :startOfDay")
    long countActiveToday(@Param("tenantId") Long tenantId, @Param("startOfDay") LocalDateTime startOfDay);

    @Query("SELECT c FROM CheckIn c WHERE c.tenantId = :tenantId AND c.createdAt >= :startDate")
    List<CheckIn> findAllByTenantIdAndDateAfter(@Param("tenantId") Long tenantId, @Param("startDate") LocalDateTime startDate);
}