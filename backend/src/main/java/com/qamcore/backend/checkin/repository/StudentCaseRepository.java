package com.qamcore.backend.checkin.repository;

import com.qamcore.backend.checkin.model.CaseStatus;
import com.qamcore.backend.checkin.model.StudentCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentCaseRepository extends JpaRepository<StudentCase, Long> {
    List<StudentCase> findAllByStudentIdAndStatusOrderByCreatedAtDesc(Long studentId, CaseStatus status);
    List<StudentCase> findAllByStudentIdOrderByCreatedAtDesc(Long studentId);
    boolean existsByStudentIdAndStatus(Long studentId, CaseStatus status);
}