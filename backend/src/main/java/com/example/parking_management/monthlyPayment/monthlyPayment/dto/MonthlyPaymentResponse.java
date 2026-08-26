package com.example.parking_management.monthlyPayment.monthlyPayment.dto;

import com.example.parking_management.monthlyPayment.monthlyPayment.model.MonthlyPaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record MonthlyPaymentResponse(
    Long id,
    Long vehicleId,
    Long customerId,
    BigDecimal monthlyAmount,
    LocalDate startDate,
    Integer dueDay,
    MonthlyPaymentStatus state,
    LocalDateTime creationDate
) {
}
