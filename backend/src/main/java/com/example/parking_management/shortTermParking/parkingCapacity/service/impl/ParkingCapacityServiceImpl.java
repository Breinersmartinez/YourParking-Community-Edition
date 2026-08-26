package com.example.parking_management.shortTermParking.parkingCapacity.service.impl;

import com.example.parking_management.monthlyPayment.monthlyPayment.repository.MonthlyPaymentRepository;
import com.example.parking_management.shortTermParking.movement.repository.MovementRepository;
import com.example.parking_management.shortTermParking.parkingCapacity.dto.CapacityRequest;
import com.example.parking_management.shortTermParking.parkingCapacity.dto.CapacityResponse;
import com.example.parking_management.shortTermParking.parkingCapacity.dto.OccupancyResponse;
import com.example.parking_management.shortTermParking.parkingCapacity.repository.ParkingCapacityRepository;
import com.example.parking_management.shortTermParking.parkingCapacity.service.ParkingCapacityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ParkingCapacityServiceImpl implements ParkingCapacityService {

    private final ParkingCapacityRepository parkingCapacityRepository;
    private final MonthlyPaymentRepository monthlyPaymentRepository;
    private final MovementRepository movementRepository;

    @Override
    public CapacityResponse configureCapacity(CapacityRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public OccupancyResponse getOccupancy() {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasAvailableSlot(Long vehicleTypeId) {
        throw new UnsupportedOperationException("Sin implementar");
    }
}
