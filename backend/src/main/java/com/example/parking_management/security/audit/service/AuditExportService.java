package com.example.parking_management.security.audit.service;

import java.time.LocalDateTime;

/**
 * Exportación de la auditoría a archivos CSV y JSON.
 */
public interface AuditExportService {

    byte[] exportCsv(LocalDateTime from, LocalDateTime to);

    byte[] exportJson(LocalDateTime from, LocalDateTime to);
}
