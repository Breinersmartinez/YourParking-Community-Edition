package com.example.parking_management.monthlyPayment.payment.dto;

import jakarta.validation.constraints.NotBlank;

public record AnnulPaymentRequest(
    @NotBlank String reason
) {
}
