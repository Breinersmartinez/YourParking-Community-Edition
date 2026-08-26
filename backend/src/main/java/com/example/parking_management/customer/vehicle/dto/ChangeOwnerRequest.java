package com.example.parking_management.customer.vehicle.dto;

import jakarta.validation.constraints.NotNull;

public record ChangeOwnerRequest(
    @NotNull Long newCustomerId
) {
}
