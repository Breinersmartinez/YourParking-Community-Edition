package com.example.parking_management.shortTermParking.movement.service.impl;

import com.example.parking_management.shortTermParking.movement.dto.MovementResponse;
import com.example.parking_management.shortTermParking.movement.dto.RegisterEntryRequest;
import com.example.parking_management.shortTermParking.movement.dto.RegisterExitRequest;
import com.example.parking_management.shortTermParking.movement.repository.MovementRepository;
import com.example.parking_management.shortTermParking.movement.service.MovementService;
import com.example.parking_management.shortTermParking.parkingCapacity.service.ParkingCapacityService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MovementServiceImpl implements MovementService {

    private final MovementRepository movementRepository;
    private final ParkingCapacityService parkingCapacityService;

    @Override
    public MovementResponse registerEntry(RegisterEntryRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public MovementResponse registerExit(Long movementId, RegisterExitRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public void annulMovement(Long movementId) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovementResponse> listVehiclesWithoutExit() {
        throw new UnsupportedOperationException("Sin implementar");
    }
}
