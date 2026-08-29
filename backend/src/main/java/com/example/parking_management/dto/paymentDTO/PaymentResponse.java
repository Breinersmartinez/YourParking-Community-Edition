package com.example.parking_management.dto.paymentDTO;

import com.example.parking_management.model.payments.enums.PaymentMethod;
import com.example.parking_management.model.payments.enums.PaymentState;
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
public class PaymentResponse {
    private Long idPayment;
    private Long idTicket;
    private BigDecimal montoTotal;
    private PaymentMethod metodoPago;
    private LocalDateTime fechaHoraPago;
    private PaymentState estadoPago;
    private String referenciaTransaccion;
}
