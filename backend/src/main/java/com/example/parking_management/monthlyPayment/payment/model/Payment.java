package com.example.parking_management.monthlyPayment.payment.model;

import com.example.parking_management.security.user.model.User;
import com.example.parking_management.shortTermParking.movement.model.Movement;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "pagos")
public class Payment {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "monto_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "origen", nullable = false, length = 20)
    private PaymentOrigin origin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movimiento_id")
    private Movement movement;

    @Column(name = "fecha_pago", nullable = false)
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registrado_por", nullable = false)
    private User registeredBy;

    @Column(name = "anulado", nullable = false)
    private Boolean voided;

    @Column(name = "motivo_anulacion", columnDefinition = "text")
    private String voidReason;

    protected Payment() {
    }

    public void annul(String reason) {
        if (Boolean.TRUE.equals(this.voided)) {
            throw new IllegalStateException("El pago ya está anulado");
        }
        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("La anulación de un pago requiere un motivo");
        }
        this.voided = true;
        this.voidReason = reason;
    }
}
