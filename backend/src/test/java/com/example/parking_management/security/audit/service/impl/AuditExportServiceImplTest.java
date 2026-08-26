package com.example.parking_management.security.audit.service.impl;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.example.parking_management.security.audit.model.AuditLog;
import com.example.parking_management.security.audit.repository.AuditLogRepository;
import com.example.parking_management.security.user.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;

class AuditExportServiceImplTest {

    private AuditExportServiceImpl servicioConLogs(AuditLog log) {
        AuditLogRepository repository = mock(AuditLogRepository.class);
        when(repository.findByDateTimeBetweenOrderByDateTimeAsc(any(), any()))
            .thenReturn(List.of(log));
        return new AuditExportServiceImpl(repository,
            new ObjectMapper().findAndRegisterModules());
    }

    private AuditLog logDePrueba() {
        User usuario = mock(User.class);
        when(usuario.getUsername()).thenReturn("admin");
        AuditLog log = mock(AuditLog.class);
        when(log.getUser()).thenReturn(usuario);
        when(log.getAction()).thenReturn("PAGO_REGISTRADO");
        when(log.getEntity()).thenReturn("pago");
        when(log.getEntityId()).thenReturn(7L);
        when(log.getDateTime()).thenReturn(LocalDateTime.of(2026, 8, 25, 10, 15, 30));
        when(log.getResult()).thenReturn("EXITO");
        when(log.getDetail()).thenReturn("Pago de $50.000 aplicado a 1 periodo");
        return log;
    }

    @Test
    void elCsvTieneEncabezadosComasYFilasCorrectas() {
        String csv = new String(servicioConLogs(logDePrueba()).exportCsv(null, null),
            StandardCharsets.UTF_8);

        assertTrue(csv.startsWith(
                "usuario,accion,entidad,entidad_id,fecha_hora,resultado,detalle"),
            "El CSV debe iniciar con los encabezados definidos, fue: " + csv);
        assertTrue(csv.contains("admin"));
        assertTrue(csv.contains("\"Pago de $50.000 aplicado a 1 periodo\""),
            "Los campos con caracteres especiales deben salir entrecomillados");
    }

    @Test
    void elJsonEsUnArregloDeObjetosConLasClavesDefinidas() {
        String json = new String(servicioConLogs(logDePrueba()).exportJson(null, null),
            StandardCharsets.UTF_8);

        assertTrue(json.contains("\"usuario\" : \"admin\""));
        assertTrue(json.contains("\"accion\" : \"PAGO_REGISTRADO\""));
        assertTrue(json.contains("\"entidad_id\" : 7"));
        assertTrue(json.trim().startsWith("[") && json.trim().endsWith("]"),
            "El JSON de exportación debe ser un arreglo de filas");
    }
}
