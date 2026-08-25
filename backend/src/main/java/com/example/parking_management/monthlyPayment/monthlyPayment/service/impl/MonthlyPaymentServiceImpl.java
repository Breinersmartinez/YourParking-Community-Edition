package com.example.parking_management.monthlyPayment.monthlyPayment.service.impl;

import com.example.parking_management.monthlyPayment.monthlyPayment.dto.MonthlyPaymentRequest;
import com.example.parking_management.monthlyPayment.monthlyPayment.dto.MonthlyPaymentResponse;
import com.example.parking_management.monthlyPayment.monthlyPayment.repository.MonthlyPaymentRepository;
import com.example.parking_management.monthlyPayment.period.repository.PeriodRepository;
import com.example.parking_management.monthlyPayment.monthlyPayment.service.MonthlyPaymentService;
import com.example.parking_management.shortTermParking.parkingCapacity.service.ParkingCapacityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MonthlyPaymentServiceImpl implements MonthlyPaymentService {

    private final MonthlyPaymentRepository monthlyPaymentRepository;
    private final PeriodRepository periodRepository;
    private final ParkingCapacityService parkingCapacityService;

    @Override
    public MonthlyPaymentResponse createMonthlyPayment(MonthlyPaymentRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public MonthlyPaymentResponse suspend(Long id) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public MonthlyPaymentResponse cancel(Long id) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public void generateMonthlyPeriod(Long monthlyPaymentId) {
        throw new UnsupportedOperationException("Sin implementar");
    }
}
