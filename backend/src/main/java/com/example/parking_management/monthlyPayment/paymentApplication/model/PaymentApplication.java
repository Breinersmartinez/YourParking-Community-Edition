package com.example.parking_management.monthlyPayment.paymentApplication.model;

import com.example.parking_management.monthlyPayment.payment.model.Payment;
import com.example.parking_management.monthlyPayment.period.model.Period;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * Registro inmutable una vez creado: la anulación se hace sobre el pago completo.
 */
@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "aplicaciones_pago")
public class PaymentApplication {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pago_id", nullable = false)
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "periodo_id", nullable = false)
    private Period period;

    @Column(name = "monto_aplicado", nullable = false, precision = 12, scale = 2)
    private BigDecimal appliedAmount;

    protected PaymentApplication() {
    }

    public PaymentApplication(Payment payment, Period period, BigDecimal appliedAmount) {
        if (appliedAmount == null || appliedAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto aplicado debe ser mayor a cero");
        }
        this.payment = payment;
        this.period = period;
        this.appliedAmount = appliedAmount;
    }
}
