package com.example.parking_management.controller;

import com.example.parking_management.dto.paymentDTO.PaymentRequest;
import com.example.parking_management.dto.paymentDTO.PaymentResponse;
import com.example.parking_management.model.payments.enums.PaymentState;
import com.example.parking_management.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/state/{estado}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByState(@PathVariable PaymentState estado) {
        return ResponseEntity.ok(paymentService.getPaymentsByState(estado));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<PaymentResponse> registerPayment(@RequestBody PaymentRequest request) {
        try {
            return ResponseEntity.ok(paymentService.registerPayment(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
