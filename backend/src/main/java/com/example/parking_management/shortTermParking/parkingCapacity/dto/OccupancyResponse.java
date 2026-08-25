package com.example.parking_management.shortTermParking.parkingCapacity.dto;

import java.util.List;

public record OccupancyResponse(
    List<VehicleTypeOccupancy> types
) {
}
