package com.example.parking_management.customer.vehicle.service;

import com.example.parking_management.customer.vehicle.dto.ChangeOwnerRequest;
import com.example.parking_management.customer.vehicle.dto.VehicleRequest;
import com.example.parking_management.customer.vehicle.dto.VehicleResponse;

public interface VehicleService {

    VehicleResponse createVehicle(VehicleRequest request);

    VehicleResponse changeOwner(Long vehicleId, ChangeOwnerRequest request);

    VehicleResponse getByLicensePlate(String licensePlate);
}
