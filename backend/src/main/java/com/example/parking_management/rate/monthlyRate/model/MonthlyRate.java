package com.example.parking_management.rate.monthlyRate.model;

import com.example.parking_management.rate.vehicleType.model.VehicleType;
import com.example.parking_management.security.user.model.User;
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
import java.time.LocalDate;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "tarifas_mensualidad")
public class MonthlyRate {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tipo_vehiculo_id", nullable = false)
    private VehicleType vehicleType;

    @Column(name = "monto_mensual", nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyAmount;

    @Column(name = "vigencia_desde", nullable = false)
    private LocalDate validFrom;

    @Column(name = "vigencia_hasta")
    private LocalDate validUntil;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creado_por", nullable = false)
    private User createdBy;

    protected MonthlyRate() {
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
}
