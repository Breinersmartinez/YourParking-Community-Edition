package com.example.parking_management.repository;

import com.example.parking_management.model.payments.Payment;
import com.example.parking_management.model.payments.enums.PaymentState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTicket_IdTicket(Long idTicket);
    List<Payment> findByEstadoPago(PaymentState estado);
}
