package com.example.parking_management.security.audit.controller;

import com.example.parking_management.security.audit.dto.AuditLogResponse;
import com.example.parking_management.security.audit.service.AuditService;
import com.example.parking_management.shared.response.ApiResponse;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
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
}
