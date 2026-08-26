package com.example.parking_management.rate.visitorRate.dto;

import com.example.parking_management.rate.visitorRate.model.BillingMode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;

public record VisitorRateRequest(
    @NotNull Long vehicleTypeId,
    @NotNull BillingMode billingMode,
    @PositiveOrZero BigDecimal dayAmount,
    @PositiveOrZero BigDecimal hourAmount,
    @PositiveOrZero BigDecimal dailyCap,
    @NotNull LocalDate validFrom
) {
}
