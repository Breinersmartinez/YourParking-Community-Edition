package com.example.parking_management.service;

import com.example.parking_management.dto.paymentDTO.PaymentRequest;
import com.example.parking_management.dto.paymentDTO.PaymentResponse;
import com.example.parking_management.model.payments.Payment;
import com.example.parking_management.model.payments.enums.PaymentState;
import com.example.parking_management.model.ticket.Ticket;
import com.example.parking_management.repository.PaymentRepository;
import com.example.parking_management.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;

    public PaymentService(PaymentRepository paymentRepository, TicketRepository ticketRepository) {
        this.paymentRepository = paymentRepository;
        this.ticketRepository = ticketRepository;
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));
        return convertToResponse(payment);
    }

    public List<PaymentResponse> getPaymentsByState(PaymentState estado) {
        return paymentRepository.findByEstadoPago(estado).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponse registerPayment(PaymentRequest request) {
        Ticket ticket = ticketRepository.findById(request.getIdTicket())
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado con ID: " + request.getIdTicket()));

        // Verificar que el ticket no tenga ya un pago
        paymentRepository.findByTicket_IdTicket(request.getIdTicket())
                .ifPresent(p -> {
                    throw new RuntimeException("El ticket ya tiene un pago registrado");
                });

        if (ticket.getTotalAmount() != null && request.getMontoTotal() == null) {
            request.setMontoTotal(ticket.getTotalAmount());
        }

        Payment payment = Payment.builder()
                .ticket(ticket)
                .montoTotal(request.getMontoTotal())
                .metodoPago(request.getMetodoPago())
                .fechaHoraPago(LocalDateTime.now())
                .estadoPago(PaymentState.PAGADO)
                .referenciaTransaccion(request.getReferenciaTransaccion())
                .build();

        Payment saved = paymentRepository.save(payment);
        return convertToResponse(saved);
    }

    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));
        paymentRepository.delete(payment);
    }

    private PaymentResponse convertToResponse(Payment payment) {
        return PaymentResponse.builder()
                .idPayment(payment.getIdPayment())
                .idTicket(payment.getTicket() != null ? payment.getTicket().getIdTicket() : null)
                .montoTotal(payment.getMontoTotal())
                .metodoPago(payment.getMetodoPago())
                .fechaHoraPago(payment.getFechaHoraPago())
                .estadoPago(payment.getEstadoPago())
                .referenciaTransaccion(payment.getReferenciaTransaccion())
                .build();
    }
}
