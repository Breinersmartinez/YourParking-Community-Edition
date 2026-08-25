package com.example.parking_management.security.audit.dto;

import java.time.LocalDateTime;

public record AuditLogResponse(
    Long id,
    String username,
    String action,
    String entity,
    Long entityId,
    LocalDateTime dateTime,
    String result,
    String detail
) {
}
