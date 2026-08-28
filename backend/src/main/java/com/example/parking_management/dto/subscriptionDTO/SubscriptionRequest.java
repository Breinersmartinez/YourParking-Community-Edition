package com.example.parking_management.dto.subscriptionDTO;

import com.example.parking_management.model.subscription.enums.SubscriptionType;
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
public class SubscriptionRequest {
    private Integer idCard;
    private String plate;
    private SubscriptionType tipoAbono;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private BigDecimal monto;
}
