package com.example.parking_management.rate.visitorRate.model;

import com.example.parking_management.rate.vehicleType.model.VehicleType;
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
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "tarifas_visitante")
public class VisitorRate {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tipo_vehiculo_id", nullable = false)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "modalidad_cobro", nullable = false, length = 20)
    private BillingMode billingMode;

    @Column(name = "monto_dia", precision = 12, scale = 2)
    private BigDecimal dayAmount;

    @Column(name = "monto_hora", precision = 12, scale = 2)
    private BigDecimal hourAmount;

    @Column(name = "tope_maximo_diario", precision = 12, scale = 2)
    private BigDecimal dailyCap;

    @Column(name = "vigencia_desde", nullable = false)
    private LocalDate validFrom;

    @Column(name = "vigencia_hasta")
    private LocalDate validUntil;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creado_por", nullable = false)
    private User createdBy;

    protected VisitorRate() {
    }

    public boolean isValidOn(LocalDate date) {
        return !validFrom.isAfter(date) && (validUntil == null || !validUntil.isBefore(date));
    }

    public void close(LocalDate date) {
        if (date.isBefore(validFrom)) {
            throw new IllegalArgumentException("La fecha de cierre no puede ser anterior a la vigencia inicial");
        }
        this.validUntil = date;
    }

    /**
     * RN-012: PER_DAY cobra bloques de 24 horas desde el ingreso, redondeando hacia arriba,
     * mínimo un día; PER_HOUR cobra fracciones de hora con tope diario.
     */
    public BigDecimal calculateCharge(LocalDateTime entry, LocalDateTime exit) {
        if (exit.isBefore(entry)) {
            throw new IllegalArgumentException("La hora de salida no puede ser anterior a la de ingreso");
        }
        long minutes = Duration.between(entry, exit).toMinutes();
        BigDecimal charge;
        if (billingMode == BillingMode.PER_DAY) {
            requireAmount(dayAmount, "monto_dia");
            long days = (long) Math.ceil(minutes / 1440.0);
            if (days == 0) {
                days = 1;
            }
            charge = dayAmount.multiply(BigDecimal.valueOf(days));
        } else {
            requireAmount(hourAmount, "monto_hora");
            long hours = (long) Math.ceil(minutes / 60.0);
            charge = hourAmount.multiply(BigDecimal.valueOf(hours));
            if (dailyCap != null && charge.compareTo(dailyCap) > 0) {
                charge = dailyCap;
            }
        }
        return charge.setScale(2, RoundingMode.HALF_UP);
    }

    private void requireAmount(BigDecimal value, String field) {
        if (value == null) {
            throw new IllegalStateException(
                "La tarifa en modalidad " + billingMode + " requiere el campo " + field);
        }
    }
}
