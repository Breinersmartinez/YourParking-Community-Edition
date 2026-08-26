package com.example.parking_management.shortTermParking.parkingCapacity.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CapacityRequest(
    @NotNull Long vehicleTypeId,
    @NotNull @Positive Integer totalCapacity
) {
}
