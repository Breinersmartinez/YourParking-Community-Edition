package com.example.parking_management.monthlyPayment.payment.service;

import com.example.parking_management.monthlyPayment.payment.dto.AccountStatementResponse;
import com.example.parking_management.monthlyPayment.payment.dto.AnnulPaymentRequest;
import com.example.parking_management.monthlyPayment.payment.dto.DebtorResponse;
import com.example.parking_management.monthlyPayment.payment.dto.PaymentResponse;
import com.example.parking_management.monthlyPayment.payment.dto.RegisterPaymentRequest;
import com.example.parking_management.monthlyPayment.payment.dto.RegisterPaymentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {

    RegisterPaymentResponse registerPayment(RegisterPaymentRequest request);

    PaymentResponse annulPayment(Long paymentId, AnnulPaymentRequest request);

    AccountStatementResponse getAccountStatement(Long customerId);

    Page<DebtorResponse> getDebtors(Pageable pageable);
}
