package com.example.parking_management.rate.monthlyRate.service;

import com.example.parking_management.rate.monthlyRate.dto.MonthlyRateRequest;
import com.example.parking_management.rate.monthlyRate.dto.MonthlyRateResponse;
import com.example.parking_management.rate.monthlyRate.model.MonthlyRate;
import com.example.parking_management.rate.visitorRate.dto.VisitorRateRequest;
import com.example.parking_management.rate.visitorRate.dto.VisitorRateResponse;
import com.example.parking_management.rate.visitorRate.model.VisitorRate;
import java.time.LocalDate;

/**
 * Administra el catálogo versionado de tarifas (mensualidad y visitante).
 * RN-006: configurar una tarifa nueva cierra la vigencia de la anterior.
 */
public interface RateService {

    MonthlyRateResponse configureMonthlyRate(MonthlyRateRequest request);

    VisitorRateResponse configureVisitorRate(VisitorRateRequest request);

    MonthlyRate getCurrentMonthlyRate(Long vehicleTypeId, LocalDate date);

    VisitorRate getCurrentVisitorRate(Long vehicleTypeId, LocalDate date);
}
