package com.example.parking_management.rate.monthlyRate.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public record MonthlyRateRequest(
    @NotNull Long vehicleTypeId,
    @NotNull @Positive BigDecimal monthlyAmount,
    @NotNull LocalDate validFrom
) {
}
