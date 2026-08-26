package com.example.parking_management.shortTermParking.parkingCapacity.service;

import com.example.parking_management.shortTermParking.parkingCapacity.dto.CapacityRequest;
import com.example.parking_management.shortTermParking.parkingCapacity.dto.CapacityResponse;
import com.example.parking_management.shortTermParking.parkingCapacity.dto.OccupancyResponse;

public interface ParkingCapacityService {

    CapacityResponse configureCapacity(CapacityRequest request);

    OccupancyResponse getOccupancy();

    boolean hasAvailableSlot(Long vehicleTypeId);
}
