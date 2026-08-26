package com.example.parking_management.shortTermParking.parkingCapacity.dto;

/**
 * RN-017: la ocupación efectiva de un tipo de vehículo es la suma de
 * mensualidades activas + visitantes presentes.
 */
public record VehicleTypeOccupancy(
    Long vehicleTypeId,
    String vehicleTypeName,
    long monthlyActiveCount,
    long visitorsInsideCount,
    long occupied,
    int totalCapacity,
    long available
) {
}
