package com.example.parking_management.dto.zoneDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoneResponse {
    private Long idZona;
    private String nombreZona;
    private String descripcion;
    private Long idPiso;
}
