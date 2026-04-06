package com.qamcore.backend.iam.repository;

import com.qamcore.backend.checkin.dto.response.GroupStatsProjection;
import com.qamcore.backend.iam.model.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface StudentGroupRepository extends JpaRepository<StudentGroup, Long> {
    boolean existsByNameAndTenantId(String name, Long tenantId);
    List<StudentGroup> findAllByTenantId(Long tenantId);
    long countByTenantId(Long tenantId);

    @Query("SELECT g.id AS groupId, g.name AS groupName, " +
            "(SELECT COUNT(u) FROM User u WHERE u.group.id = g.id AND u.role = 'STUDENT') AS totalStudents, " +
            "(SELECT COUNT(DISTINCT c.user.id) FROM CheckIn c WHERE c.user.group.id = g.id AND c.createdAt >= :startOfWeek) AS activeStudents, " +
            "(SELECT COUNT(ic) FROM InviteCode ic WHERE ic.group.id = g.id AND ic.user IS NULL) AS unusedCodes " +
            "FROM StudentGroup g WHERE g.tenant.id = :tenantId")
    List<GroupStatsProjection> getGroupStats(@Param("tenantId") Long tenantId, @Param("startOfWeek") LocalDateTime startOfWeek);
}