package com.example.parking_management.monthlyPayment.payment.dto;

import com.example.parking_management.monthlyPayment.payment.model.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;

public record RegisterPaymentRequest(
    @NotEmpty List<Long> periodIds,
    @NotNull @Positive BigDecimal totalAmount,
    @NotNull PaymentMethod paymentMethod,
    Long registeredByUserId
) {
}
