package com.example.parking_management.reporting.dashboard.dto;

import com.example.parking_management.shortTermParking.parkingCapacity.dto.VehicleTypeOccupancy;
import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
    long activeMonthlyPayments,
    long vehiclesInside,
    BigDecimal todayCollected,
    List<VehicleTypeOccupancy> occupancy
) {
}
