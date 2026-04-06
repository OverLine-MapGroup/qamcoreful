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

    @Query(value = "SELECT DISTINCT ON (user_id) * FROM checkins WHERE user_id IN :userIds ORDER BY user_id, created_at DESC", nativeQuery = true)
    List<CheckIn> findLatestCheckInsByUserIds(@Param("userIds") List<Long> userIds);

    Page<CheckIn> findAllByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query(value = "SELECT * FROM (SELECT DISTINCT ON (user_id) * FROM checkins WHERE tenant_id = :tenantId ORDER BY user_id, created_at DESC) AS latest " +
            "WHERE (CAST(:filter AS text) = '' OR CAST(risk_level AS text) = :filter)",
            countQuery = "SELECT count(*) FROM (SELECT DISTINCT ON (user_id) * FROM checkins WHERE tenant_id = :tenantId ORDER BY user_id, created_at DESC) AS latest " +
                    "WHERE (CAST(:filter AS text) = '' OR CAST(risk_level AS text) = :filter)",
            nativeQuery = true)
    Page<CheckIn> findLatestCheckInsPaged(@Param("tenantId") Long tenantId, @Param("filter") String filter, Pageable pageable);

    @Query(value = "SELECT DISTINCT ON (user_id) * FROM checkins WHERE tenant_id = :tenantId ORDER BY user_id, created_at DESC", nativeQuery = true)
    List<CheckIn> findLatestCheckInsByTenant(@Param("tenantId") Long tenantId);

    @Query("SELECT count(c) FROM CheckIn c WHERE c.tenantId = :tenantId AND c.createdAt >= :startOfDay")
    long countActiveToday(@Param("tenantId") Long tenantId, @Param("startOfDay") LocalDateTime startOfDay);

    @Query("SELECT c FROM CheckIn c WHERE c.tenantId = :tenantId AND c.createdAt >= :startDate")
    List<CheckIn> findAllByTenantIdAndDateAfter(@Param("tenantId") Long tenantId, @Param("startDate") LocalDateTime startDate);
}