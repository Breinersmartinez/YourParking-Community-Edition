package com.example.parking_management.rate.monthlyRate.service.impl;

import com.example.parking_management.rate.monthlyRate.dto.MonthlyRateRequest;
import com.example.parking_management.rate.monthlyRate.dto.MonthlyRateResponse;
import com.example.parking_management.rate.monthlyRate.model.MonthlyRate;
import com.example.parking_management.rate.monthlyRate.repository.MonthlyRateRepository;
import com.example.parking_management.rate.monthlyRate.service.RateService;
import com.example.parking_management.rate.visitorRate.dto.VisitorRateRequest;
import com.example.parking_management.rate.visitorRate.dto.VisitorRateResponse;
import com.example.parking_management.rate.visitorRate.model.VisitorRate;
import com.example.parking_management.rate.visitorRate.repository.VisitorRateRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RateServiceImpl implements RateService {

    private final MonthlyRateRepository monthlyRateRepository;
    private final VisitorRateRepository visitorRateRepository;

    @Override
    public MonthlyRateResponse configureMonthlyRate(MonthlyRateRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public VisitorRateResponse configureVisitorRate(VisitorRateRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public MonthlyRate getCurrentMonthlyRate(Long vehicleTypeId, LocalDate date) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public VisitorRate getCurrentVisitorRate(Long vehicleTypeId, LocalDate date) {
        throw new UnsupportedOperationException("Sin implementar");
    }
}
