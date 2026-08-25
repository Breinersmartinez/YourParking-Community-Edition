package com.example.parking_management.monthlyPayment.monthlyPayment.controller;

import com.example.parking_management.monthlyPayment.monthlyPayment.dto.MonthlyPaymentRequest;
import com.example.parking_management.monthlyPayment.monthlyPayment.dto.MonthlyPaymentResponse;
import com.example.parking_management.monthlyPayment.monthlyPayment.service.MonthlyPaymentService;
import com.example.parking_management.shared.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mensualidades")
public class MonthlyPaymentController {

    private final MonthlyPaymentService monthlyPaymentService;

    public MonthlyPaymentController(MonthlyPaymentService monthlyPaymentService) {
        this.monthlyPaymentService = monthlyPaymentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MonthlyPaymentResponse>> create(
        @Valid @RequestBody MonthlyPaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
            monthlyPaymentService.createMonthlyPayment(request), "Mensualidad creada"));
    }

    @PutMapping("/{id}/suspender")
    public ResponseEntity<ApiResponse<MonthlyPaymentResponse>> suspend(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(monthlyPaymentService.suspend(id)));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<ApiResponse<MonthlyPaymentResponse>> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(monthlyPaymentService.cancel(id)));
    }
}
