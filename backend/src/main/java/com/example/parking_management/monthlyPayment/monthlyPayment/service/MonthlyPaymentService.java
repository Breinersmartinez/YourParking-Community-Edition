package com.example.parking_management.monthlyPayment.monthlyPayment.service;

import com.example.parking_management.monthlyPayment.monthlyPayment.dto.MonthlyPaymentRequest;
import com.example.parking_management.monthlyPayment.monthlyPayment.dto.MonthlyPaymentResponse;

public interface MonthlyPaymentService {

    MonthlyPaymentResponse createMonthlyPayment(MonthlyPaymentRequest request);

    MonthlyPaymentResponse suspend(Long id);

    MonthlyPaymentResponse cancel(Long id);

    void generateMonthlyPeriod(Long monthlyPaymentId);
}
