package com.example.parking_management.shortTermParking.movement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterEntryRequest(
    @NotBlank
    @Size(max = 10)
    String capturedPlate,
    @NotNull Long vehicleTypeId,
    Long vehicleId
) {
}
