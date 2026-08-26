package com.example.parking_management.security.audit.repository;

import com.example.parking_management.security.audit.model.AuditLog;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByUserIdAndDateTimeBetween(Long userId, LocalDateTime from, LocalDateTime to,
                                                  Pageable pageable);

    Page<AuditLog> findByEntityAndEntityId(String entity, Long entityId, Pageable pageable);

    List<AuditLog> findByDateTimeBetweenOrderByDateTimeAsc(LocalDateTime from, LocalDateTime to);
}
