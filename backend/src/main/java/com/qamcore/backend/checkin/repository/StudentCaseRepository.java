package com.qamcore.backend.checkin.repository;

import com.qamcore.backend.checkin.model.CaseStatus;
import com.qamcore.backend.checkin.model.StudentCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface StudentCaseRepository extends JpaRepository<StudentCase, Long> {
    @Query("SELECT sc FROM StudentCase sc LEFT JOIN FETCH sc.psychologist WHERE sc.student.id = :studentId AND sc.status = :status ORDER BY sc.createdAt DESC")
    List<StudentCase> findAllByStudentIdAndStatusOrderByCreatedAtDesc(@Param("studentId") Long studentId, @Param("status") CaseStatus status);
    
    @Query("SELECT sc FROM StudentCase sc LEFT JOIN FETCH sc.psychologist WHERE sc.student.id = :studentId ORDER BY sc.createdAt DESC")
    List<StudentCase> findAllByStudentIdOrderByCreatedAtDesc(@Param("studentId") Long studentId);
    
    boolean existsByStudentIdAndStatus(Long studentId, CaseStatus status);
    
    @Query("SELECT sc FROM StudentCase sc LEFT JOIN FETCH sc.psychologist WHERE sc.student.id = :studentId AND sc.status = :status")
    StudentCase findByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") CaseStatus status);
    
    @Query("SELECT sc FROM StudentCase sc LEFT JOIN FETCH sc.student WHERE sc.psychologist.id = :psychologistId AND sc.status = :status ORDER BY sc.createdAt DESC")
    List<StudentCase> findAllByPsychologistIdAndStatusOrderByCreatedAtDesc(@Param("psychologistId") Long psychologistId, @Param("status") CaseStatus status);
}