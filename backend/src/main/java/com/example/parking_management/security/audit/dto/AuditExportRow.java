package com.example.parking_management.security.audit.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.time.LocalDateTime;

/**
 * Fila de exportación de auditoría: las anotaciones definen a la vez
 * las claves del JSON y los encabezados del CSV.
 */
@JsonPropertyOrder({"usuario", "accion", "entidad", "entidad_id", "fecha_hora", "resultado", "detalle"})
public record AuditExportRow(
    @JsonProperty("usuario") String username,
    @JsonProperty("accion") String action,
    @JsonProperty("entidad") String entity,
    @JsonProperty("entidad_id") Long entityId,
    @JsonProperty("fecha_hora") LocalDateTime dateTime,
    @JsonProperty("resultado") String result,
    @JsonProperty("detalle") String detail
) {
}
