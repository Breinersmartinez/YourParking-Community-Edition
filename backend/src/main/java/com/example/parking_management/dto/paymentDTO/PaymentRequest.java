package com.example.parking_management.dto.paymentDTO;

import com.example.parking_management.model.payments.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long idTicket;
    private BigDecimal montoTotal;
    private PaymentMethod metodoPago;
    private String referenciaTransaccion;
}
