package com.example.parking_management.security.audit.service.impl;

import com.example.parking_management.security.audit.dto.AuditLogResponse;
import com.example.parking_management.security.audit.model.AuditLog;
import com.example.parking_management.security.audit.repository.AuditLogRepository;
import com.example.parking_management.security.audit.service.AuditService;
import com.example.parking_management.security.user.repository.UserRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Override
    public void registerEvent(Long userId, String action, String entity, Long entityId,
                              boolean success, String detail) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponse> search(Long userId, LocalDateTime from, LocalDateTime to,
                                         Pageable pageable) {
        throw new UnsupportedOperationException("Sin implementar");
    }
}
