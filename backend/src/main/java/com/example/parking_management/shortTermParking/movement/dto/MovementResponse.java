package com.example.parking_management.shortTermParking.movement.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovementResponse(
    Long id,
    String capturedPlate,
    Long vehicleTypeId,
    Boolean monthlyCustomer,
    LocalDateTime entryTime,
    LocalDateTime exitTime,
    BigDecimal chargedAmount,
    Boolean voided
) {
}
