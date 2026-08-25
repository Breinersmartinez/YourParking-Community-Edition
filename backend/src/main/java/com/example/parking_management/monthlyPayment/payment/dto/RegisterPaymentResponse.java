package com.example.parking_management.monthlyPayment.payment.dto;

import java.util.List;

public record RegisterPaymentResponse(
    Long paymentId,
    List<PeriodBalanceResponse> updatedPeriods
) {
}
