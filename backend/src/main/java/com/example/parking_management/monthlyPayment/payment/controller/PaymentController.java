package com.example.parking_management.monthlyPayment.payment.controller;

import com.example.parking_management.monthlyPayment.payment.dto.AccountStatementResponse;
import com.example.parking_management.monthlyPayment.payment.dto.AnnulPaymentRequest;
import com.example.parking_management.monthlyPayment.payment.dto.DebtorResponse;
import com.example.parking_management.monthlyPayment.payment.dto.PaymentResponse;
import com.example.parking_management.monthlyPayment.payment.dto.RegisterPaymentRequest;
import com.example.parking_management.monthlyPayment.payment.dto.RegisterPaymentResponse;
import com.example.parking_management.monthlyPayment.payment.service.PaymentService;
import com.example.parking_management.shared.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/api/pagos")
    public ResponseEntity<ApiResponse<RegisterPaymentResponse>> register(
        @Valid @RequestBody RegisterPaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.registerPayment(request), "Pago registrado"));
    }

    @PutMapping("/api/pagos/{id}/anular")
    @PreAuthorize("hasAuthority('PAGOS_ANULAR')")
    public ResponseEntity<ApiResponse<PaymentResponse>> annul(
        @PathVariable Long id, @Valid @RequestBody AnnulPaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.annulPayment(id, request)));
    }

    @GetMapping("/api/clientes/{id}/estado-cuenta")
    public ResponseEntity<ApiResponse<AccountStatementResponse>> accountStatement(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.getAccountStatement(id)));
    }

    @GetMapping("/api/deudores")
    public ResponseEntity<ApiResponse<Page<DebtorResponse>>> debtors(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.getDebtors(pageable)));
    }
}
