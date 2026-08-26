package com.example.parking_management.security.audit.controller;

import com.example.parking_management.security.audit.dto.AuditLogResponse;
import com.example.parking_management.security.audit.service.AuditExportService;
import com.example.parking_management.security.audit.service.AuditService;
import com.example.parking_management.shared.response.ApiResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auditoria")
public class AuditController {

    private final AuditService auditService;
    private final AuditExportService auditExportService;

    public AuditController(AuditService auditService, AuditExportService auditExportService) {
        this.auditService = auditService;
        this.auditExportService = auditExportService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('AUDITORIA_READ')")
    public ResponseEntity<ApiResponse<Page<AuditLogResponse>>> search(
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) LocalDateTime from,
        @RequestParam(required = false) LocalDateTime to,
        Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(auditService.search(userId, from, to, pageable)));
    }

    @GetMapping("/export")
    @PreAuthorize("hasAuthority('AUDITORIA_READ')")
    public ResponseEntity<byte[]> export(
        @RequestParam(defaultValue = "json") String formato,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {

        boolean esCsv = switch (formato.toLowerCase()) {
            case "csv" -> true;
            case "json" -> false;
            default -> throw new IllegalArgumentException("El parámetro 'formato' solo admite 'csv' o 'json'");
        };

        byte[] contenido = esCsv
            ? auditExportService.exportCsv(from, to)
            : auditExportService.exportJson(from, to);

        String archivo = "auditoria_"
            + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))
            + (esCsv ? ".csv" : ".json");

        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=\"" + archivo + "\"")
            .contentType(esCsv
                ? MediaType.valueOf("text/csv;charset=UTF-8")
                : MediaType.APPLICATION_JSON)
            .body(contenido);
    }
}
