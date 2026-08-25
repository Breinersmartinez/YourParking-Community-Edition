package com.example.parking_management.monthlyPayment.payment.dto;

import com.example.parking_management.monthlyPayment.period.model.PeriodStatus;
import java.math.BigDecimal;

public record PeriodBalanceResponse(
    Long periodId,
    PeriodStatus resultingStatus,
    BigDecimal remainingBalance
) {
}
