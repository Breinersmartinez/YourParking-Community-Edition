package com.example.parking_management.monthlyPayment.payment.dto;

import java.math.BigDecimal;

public record DebtorResponse(
    Long customerId,
    String customerName,
    String licensePlate,
    long overduePeriods,
    BigDecimal totalDebt
) {
}
