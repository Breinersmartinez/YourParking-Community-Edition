package com.example.parking_management.dto.incidentDTO;

import com.example.parking_management.model.incident.enums.IncidentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentRequest {
    private Long idEspacio;
    private String plate;
    private LocalDateTime fechaHora;
    private IncidentType tipoIncidente;
    private String descripcion;
}
