package com.example.parking_management.customer.vehicle.dto;

public record VehicleResponse(
    Long id,
    String licensePlate,
    String color,
    Long vehicleTypeId,
    String vehicleTypeName,
    Long customerId,
    Boolean active
) {
}
