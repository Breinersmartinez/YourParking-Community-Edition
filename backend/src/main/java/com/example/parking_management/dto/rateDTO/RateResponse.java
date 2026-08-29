package com.example.parking_management.dto.rateDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RateResponse {
    private Long idTarifa;
    private String tipoVehiculo;
    private BigDecimal precioHora;
    private BigDecimal precioFraccion;
    private BigDecimal precioDia;
    private BigDecimal precioMes;
    private BigDecimal precioAnio;
    private LocalDate fechaVigenciaInicio;
    private LocalDate fechaVigenciaFin;
}
