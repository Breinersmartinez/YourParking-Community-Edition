package com.example.parking_management.security.audit.service.impl;

import com.example.parking_management.security.audit.dto.AuditExportRow;
import com.example.parking_management.security.audit.model.AuditLog;
import com.example.parking_management.security.audit.repository.AuditLogRepository;
import com.example.parking_management.security.audit.service.AuditExportService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuditExportServiceImpl implements AuditExportService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;
    private final CsvMapper csvMapper = buildCsvMapper();

    private static CsvMapper buildCsvMapper() {
        CsvMapper mapper = new CsvMapper();
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }

    @Override
    public byte[] exportCsv(LocalDateTime from, LocalDateTime to) {
        try {
            CsvSchema schema = csvMapper.schemaFor(AuditExportRow.class).withHeader();
            return csvMapper.writerFor(AuditExportRow[].class).with(schema)
                .writeValueAsBytes(fetchRows(from, to));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("No se pudo generar el CSV de auditoría", e);
        }
    }

    @Override
    public byte[] exportJson(LocalDateTime from, LocalDateTime to) {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsBytes(fetchRows(from, to));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("No se pudo generar el JSON de auditoría", e);
        }
    }

    private AuditExportRow[] fetchRows(LocalDateTime from, LocalDateTime to) {
        List<AuditLog> logs = auditLogRepository.findByDateTimeBetweenOrderByDateTimeAsc(
            from == null ? LocalDateTime.MIN : from,
            to == null ? LocalDateTime.MAX : to);
        return logs.stream()
            .map(a -> new AuditExportRow(
                a.getUser().getUsername(),
                a.getAction(),
                a.getEntity(),
                a.getEntityId(),
                a.getDateTime(),
                a.getResult(),
                a.getDetail()))
            .toArray(AuditExportRow[]::new);
    }
}
