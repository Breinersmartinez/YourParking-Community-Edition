package com.example.parking_management.model.payments;

import com.example.parking_management.audit.Auditable;
import com.example.parking_management.model.payments.enums.PaymentMethod;
import com.example.parking_management.model.payments.enums.PaymentState;
import com.example.parking_management.model.ticket.Ticket;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PAGO")
public class Payment extends Auditable<Payment> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PAGO")
    private Long idPayment;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_TICKET")
    private Ticket ticket;

    @Column(name = "MONTO_TOTAL", precision = 12, scale = 2, nullable = false)
    private BigDecimal montoTotal;

    @Enumerated(EnumType.STRING)
    @Column(name = "METODO_PAGO", nullable = false)
    private PaymentMethod metodoPago;

    @Column(name = "FECHA_HORA_PAGO")
    private LocalDateTime fechaHoraPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO_PAGO", nullable = false)
    private PaymentState estadoPago;

    @Column(name = "REFERENCIA_TRANSACCION")
    private String referenciaTransaccion;
}
