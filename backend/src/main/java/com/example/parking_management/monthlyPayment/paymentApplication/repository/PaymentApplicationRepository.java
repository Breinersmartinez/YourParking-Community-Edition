package com.example.parking_management.monthlyPayment.paymentApplication.repository;

import com.example.parking_management.monthlyPayment.paymentApplication.model.PaymentApplication;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentApplicationRepository extends JpaRepository<PaymentApplication, Long> {

    List<PaymentApplication> findByPeriodId(Long periodId);

    List<PaymentApplication> findByPaymentId(Long paymentId);
}
