package com.example.parking_management.rate.visitorRate.dto;

import com.example.parking_management.rate.visitorRate.model.BillingMode;
import java.math.BigDecimal;
import java.time.LocalDate;

public record VisitorRateResponse(
    Long id,
    Long vehicleTypeId,
    BillingMode billingMode,
    BigDecimal dayAmount,
    BigDecimal hourAmount,
    BigDecimal dailyCap,
    LocalDate validFrom,
    LocalDate validUntil
) {
}
