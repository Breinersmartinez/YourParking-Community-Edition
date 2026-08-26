package com.example.parking_management.reporting.dashboard.service.impl;

import com.example.parking_management.monthlyPayment.monthlyPayment.repository.MonthlyPaymentRepository;
import com.example.parking_management.reporting.dashboard.dto.DashboardResponse;
import com.example.parking_management.reporting.dashboard.service.DashboardService;
import com.example.parking_management.shortTermParking.movement.repository.MovementRepository;
import com.example.parking_management.shortTermParking.parkingCapacity.service.ParkingCapacityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Proyección de solo lectura: nunca escribe en otros módulos.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final MonthlyPaymentRepository monthlyPaymentRepository;
    private final MovementRepository movementRepository;
    private final ParkingCapacityService parkingCapacityService;

    @Override
    public DashboardResponse getSummary() {
        throw new UnsupportedOperationException("Sin implementar");
    }
}
