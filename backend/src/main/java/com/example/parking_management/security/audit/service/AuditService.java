package com.example.parking_management.security.audit.service;

import com.example.parking_management.security.audit.dto.AuditLogResponse;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * RN-010: registro inmutable de operaciones críticas.
 */
public interface AuditService {

    void registerEvent(Long userId, String action, String entity, Long entityId,
                       boolean success, String detail);

    Page<AuditLogResponse> search(Long userId, LocalDateTime from, LocalDateTime to, Pageable pageable);
}
