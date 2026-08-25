package com.example.parking_management.monthlyPayment.monthlyPayment.model;

import com.example.parking_management.customer.customer.model.Customer;
import com.example.parking_management.customer.vehicle.model.Vehicle;
import com.example.parking_management.rate.monthlyRate.model.MonthlyRate;
import com.example.parking_management.security.user.model.User;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "mensualidades")
public class MonthlyPayment {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehiculo_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tarifa_mensualidad_id", nullable = false)
    private MonthlyRate monthlyRate;

    @Column(name = "monto_mensual", nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyAmount;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate startDate;

    @Column(name = "dia_vencimiento", nullable = false)
    private Integer dueDay;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private MonthlyPaymentStatus state;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creado_por", nullable = false)
    private User createdBy;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime creationDate;

    protected MonthlyPayment() {
    }

    public void activate() {
        transitionTo(MonthlyPaymentStatus.ACTIVE);
    }

    public void suspend() {
        transitionTo(MonthlyPaymentStatus.SUSPENDED);
    }

    public void cancel() {
        transitionTo(MonthlyPaymentStatus.CANCELLED);
    }

    public boolean isActive() {
        return this.state == MonthlyPaymentStatus.ACTIVE;
    }

    private void transitionTo(MonthlyPaymentStatus target) {
        if (this.state == null || !this.state.canTransitionTo(target)) {
            throw new IllegalStateException(
                "Transición de estado inválida: " + this.state + " -> " + target);
        }
        this.state = target;
    }
}
