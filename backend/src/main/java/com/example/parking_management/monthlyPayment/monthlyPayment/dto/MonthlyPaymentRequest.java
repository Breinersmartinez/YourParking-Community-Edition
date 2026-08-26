package com.example.parking_management.monthlyPayment.monthlyPayment.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record MonthlyPaymentRequest(
    @NotNull Long vehicleId,
    @NotNull Long customerId,
    @NotNull LocalDate startDate,
    Long monthlyRateId
) {
}
