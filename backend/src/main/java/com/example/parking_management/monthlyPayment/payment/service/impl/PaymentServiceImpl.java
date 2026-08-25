package com.example.parking_management.monthlyPayment.payment.service.impl;

import com.example.parking_management.monthlyPayment.payment.dto.AccountStatementResponse;
import com.example.parking_management.monthlyPayment.payment.dto.AnnulPaymentRequest;
import com.example.parking_management.monthlyPayment.payment.dto.DebtorResponse;
import com.example.parking_management.monthlyPayment.payment.dto.PaymentResponse;
import com.example.parking_management.monthlyPayment.payment.dto.RegisterPaymentRequest;
import com.example.parking_management.monthlyPayment.payment.dto.RegisterPaymentResponse;
import com.example.parking_management.monthlyPayment.payment.repository.PaymentRepository;
import com.example.parking_management.monthlyPayment.paymentApplication.repository.PaymentApplicationRepository;
import com.example.parking_management.monthlyPayment.payment.service.PaymentService;
import com.example.parking_management.monthlyPayment.period.repository.PeriodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentApplicationRepository paymentApplicationRepository;
    private final PeriodRepository periodRepository;

    @Override
    public RegisterPaymentResponse registerPayment(RegisterPaymentRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public PaymentResponse annulPayment(Long paymentId, AnnulPaymentRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public AccountStatementResponse getAccountStatement(Long customerId) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DebtorResponse> getDebtors(Pageable pageable) {
        throw new UnsupportedOperationException("Sin implementar");
    }
}
