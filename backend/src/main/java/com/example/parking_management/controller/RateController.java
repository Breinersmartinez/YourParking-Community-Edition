package com.example.parking_management.controller;

import com.example.parking_management.dto.rateDTO.RateRequest;
import com.example.parking_management.dto.rateDTO.RateResponse;
import com.example.parking_management.service.RateService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rates")
@CrossOrigin(origins = "*")
public class RateController {

    private final RateService rateService;

    public RateController(RateService rateService) {
        this.rateService = rateService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<List<RateResponse>> getAllRates() {
        return ResponseEntity.ok(rateService.getAllRates());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<RateResponse> getRateById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(rateService.getRateById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/calculate")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<BigDecimal> calculateCost(
            @RequestParam String tipoVehiculo,
            @RequestParam LocalDateTime entry,
            @RequestParam LocalDateTime exit) {
        try {
            return ResponseEntity.ok(rateService.calculateCost(tipoVehiculo, entry, exit));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RateResponse> createRate(@RequestBody RateRequest request) {
        try {
            return ResponseEntity.ok(rateService.createRate(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RateResponse> updateRate(@PathVariable Long id, @RequestBody RateRequest request) {
        try {
            return ResponseEntity.ok(rateService.updateRate(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRate(@PathVariable Long id) {
        try {
            rateService.deleteRate(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
