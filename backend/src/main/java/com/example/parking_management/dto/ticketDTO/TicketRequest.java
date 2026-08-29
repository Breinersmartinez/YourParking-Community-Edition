package com.example.parking_management.dto.ticketDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketRequest {
    private String plate;
    private Long idEspacio;
    private LocalDateTime entryDate;
}
