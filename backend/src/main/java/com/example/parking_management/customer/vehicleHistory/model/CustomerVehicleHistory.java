package com.example.parking_management.customer.vehicleHistory.model;

import com.example.parking_management.customer.customer.model.Customer;
import com.example.parking_management.customer.vehicle.model.Vehicle;
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
import java.time.LocalDateTime;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "vehiculo_cliente_historial")
public class CustomerVehicleHistory {

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

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "fecha_fin")
    private LocalDateTime endDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registrado_por", nullable = false)
    private User registeredBy;

    protected CustomerVehicleHistory() {
    }

    public void close(LocalDateTime date) {
        if (date.isBefore(startDate)) {
            throw new IllegalArgumentException("La fecha de cierre no puede ser anterior al inicio de la tenencia");
        }
        this.endDate = date;
    }
}
