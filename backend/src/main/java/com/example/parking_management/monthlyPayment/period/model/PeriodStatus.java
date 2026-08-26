package com.example.parking_management.monthlyPayment.period.model;

/**
 * Estado derivado del periodo: nunca se persiste (RN-011).
 */
public enum PeriodStatus {
    PENDING,
    PARTIAL,
    PAID,
    OVERDUE
}
