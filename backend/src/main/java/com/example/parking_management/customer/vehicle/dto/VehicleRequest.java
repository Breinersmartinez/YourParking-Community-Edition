package com.example.parking_management.customer.vehicle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record VehicleRequest(
    @NotBlank
    @Size(max = 10)
    @Pattern(regexp = "^[A-Z0-9\\-]+$", message = "La placa solo admite mayúsculas, números y guiones")
    String licensePlate,
    @NotNull Long vehicleTypeId,
    @Size(max = 30) String color,
    Long customerId
) {
}
