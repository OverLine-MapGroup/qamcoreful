package com.qamcore.backend.complaint.repository;

import com.qamcore.backend.complaint.model.Complaint;
import com.qamcore.backend.complaint.model.ComplaintCategory;
import com.qamcore.backend.complaint.model.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Page<Complaint> findAllByTenantIdAndCategoryInAndStatusInOrderByCreatedAtDesc(
            Long tenantId,
            List<ComplaintCategory> categories,
            List<ComplaintStatus> statuses,
            Pageable pageable
    );
}
