package com.example.parking_management.rate.monthlyRate.controller;

import com.example.parking_management.rate.monthlyRate.dto.MonthlyRateRequest;
import com.example.parking_management.rate.monthlyRate.dto.MonthlyRateResponse;
import com.example.parking_management.rate.monthlyRate.service.RateService;
import com.example.parking_management.rate.visitorRate.dto.VisitorRateRequest;
import com.example.parking_management.rate.visitorRate.dto.VisitorRateResponse;
import com.example.parking_management.shared.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tarifas")
public class RateController {

    private final RateService rateService;

    public RateController(RateService rateService) {
        this.rateService = rateService;
    }

    @PostMapping("/mensualidad")
    @PreAuthorize("hasAuthority('TARIFAS_CREATE')")
    public ResponseEntity<ApiResponse<MonthlyRateResponse>> configureMonthly(
        @Valid @RequestBody MonthlyRateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(rateService.configureMonthlyRate(request)));
    }

    @PostMapping("/visitante")
    @PreAuthorize("hasAuthority('TARIFAS_CREATE')")
    public ResponseEntity<ApiResponse<VisitorRateResponse>> configureVisitor(
        @Valid @RequestBody VisitorRateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(rateService.configureVisitorRate(request)));
    }
}
