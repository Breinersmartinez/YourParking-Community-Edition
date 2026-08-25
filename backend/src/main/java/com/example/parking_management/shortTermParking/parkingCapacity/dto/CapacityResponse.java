package com.example.parking_management.shortTermParking.parkingCapacity.dto;

public record CapacityResponse(
    Long id,
    Long vehicleTypeId,
    Integer totalCapacity
) {
}
