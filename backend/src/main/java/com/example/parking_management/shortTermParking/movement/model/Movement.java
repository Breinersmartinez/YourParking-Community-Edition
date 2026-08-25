package com.example.parking_management.shortTermParking.movement.model;

import com.example.parking_management.customer.vehicle.model.Vehicle;
import com.example.parking_management.rate.visitorRate.model.VisitorRate;
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
import java.time.LocalDateTime;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "movimientos")
public class Movement {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehiculo_id")
    private Vehicle vehicle;

    @Column(name = "placa_capturada", nullable = false, length = 10)
    private String capturedPlate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tipo_vehiculo_id", nullable = false)
    private VehicleType vehicleType;

    @Column(name = "es_cliente_mensual", nullable = false)
    private Boolean monthlyCustomer;

    @Column(name = "hora_ingreso", nullable = false)
    private LocalDateTime entryTime;

    @Column(name = "hora_salida")
    private LocalDateTime exitTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarifa_visitante_id")
    private VisitorRate visitorRate;

    @Column(name = "monto_cobrado", precision = 12, scale = 2)
    private BigDecimal chargedAmount;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registrado_por_ingreso", nullable = false)
    private User entryRegisteredBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registrado_por_salida")
    private User exitRegisteredBy;

    @Column(name = "anulado", nullable = false)
    private Boolean voided;

    protected Movement() {
    }

    public void registerExit(LocalDateTime time, BigDecimal amount, User registeredBy) {
        if (this.exitTime != null) {
            throw new IllegalStateException("El movimiento ya tiene una salida registrada");
        }
        if (time.isBefore(this.entryTime)) {
            throw new IllegalArgumentException("La hora de salida no puede ser anterior a la de ingreso");
        }
        this.exitTime = time;
        this.chargedAmount = amount;
        this.exitRegisteredBy = registeredBy;
    }

    public boolean isInside() {
        return exitTime == null;
    }

    public void annul() {
        this.voided = true;
    }
}
