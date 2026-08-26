package com.example.parking_management.monthlyPayment.monthlyPayment.model;

public enum MonthlyPaymentStatus {
    ACTIVE,
    SUSPENDED,
    CANCELLED;

    public boolean canTransitionTo(MonthlyPaymentStatus target) {
        return switch (this) {
            case ACTIVE -> target == SUSPENDED || target == CANCELLED;
            case SUSPENDED -> target == ACTIVE || target == CANCELLED;
            case CANCELLED -> false;
        };
    }
}
