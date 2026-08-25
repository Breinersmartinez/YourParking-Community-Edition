package com.example.parking_management.monthlyPayment.payment.repository;

import com.example.parking_management.monthlyPayment.payment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
