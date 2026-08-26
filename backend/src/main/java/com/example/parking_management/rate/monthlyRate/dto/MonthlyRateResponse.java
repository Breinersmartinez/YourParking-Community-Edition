package com.example.parking_management.rate.monthlyRate.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MonthlyRateResponse(
    Long id,
    Long vehicleTypeId,
    BigDecimal monthlyAmount,
    LocalDate validFrom,
    LocalDate validUntil
) {
}
