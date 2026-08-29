package com.example.parking_management.dto.reservationDTO;

import com.example.parking_management.model.reservation.enums.ReservationState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private Long idReserva;
    private Integer idCard;
    private Long idEspacio;
    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;
    private ReservationState estado;
    private BigDecimal montoReserva;
}
