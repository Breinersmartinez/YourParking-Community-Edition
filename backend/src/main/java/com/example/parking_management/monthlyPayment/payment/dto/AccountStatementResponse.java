package com.example.parking_management.monthlyPayment.payment.dto;

import java.math.BigDecimal;
import java.util.List;

public record AccountStatementResponse(
    Long customerId,
    String customerName,
    List<PeriodBalanceResponse> periods,
    BigDecimal totalDebt
) {
}
