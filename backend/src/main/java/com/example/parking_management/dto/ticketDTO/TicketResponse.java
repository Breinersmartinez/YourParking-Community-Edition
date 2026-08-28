package com.example.parking_management.dto.ticketDTO;

import com.example.parking_management.model.ticket.enums.TicketState;
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
public class TicketResponse {
    private Long idTicket;
    private String plate;
    private Long idEspacio;
    private LocalDateTime entryDate;
    private LocalDateTime exitDate;
    private Long totalMinutes;
    private BigDecimal totalAmount;
    private TicketState state;
}
