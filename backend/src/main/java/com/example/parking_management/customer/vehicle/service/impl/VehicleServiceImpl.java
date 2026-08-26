package com.example.parking_management.customer.vehicle.service.impl;

import com.example.parking_management.customer.vehicle.dto.ChangeOwnerRequest;
import com.example.parking_management.customer.vehicle.dto.VehicleRequest;
import com.example.parking_management.customer.vehicle.dto.VehicleResponse;
import com.example.parking_management.customer.vehicle.repository.VehicleRepository;
import com.example.parking_management.customer.vehicleHistory.repository.CustomerVehicleHistoryRepository;
import com.example.parking_management.customer.vehicle.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CustomerVehicleHistoryRepository customerVehicleHistoryRepository;

    @Override
    public VehicleResponse createVehicle(VehicleRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public VehicleResponse changeOwner(Long vehicleId, ChangeOwnerRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse getByLicensePlate(String licensePlate) {
        throw new UnsupportedOperationException("Sin implementar");
    }
}
