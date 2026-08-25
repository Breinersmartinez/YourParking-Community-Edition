package com.example.parking_management.monthlyPayment.payment.dto;

import com.example.parking_management.monthlyPayment.payment.model.PaymentMethod;
import com.example.parking_management.monthlyPayment.payment.model.PaymentOrigin;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
    Long id,
    BigDecimal totalAmount,
    PaymentOrigin origin,
    LocalDateTime paymentDate,
    PaymentMethod paymentMethod,
    Boolean voided,
    String voidReason
) {
}
