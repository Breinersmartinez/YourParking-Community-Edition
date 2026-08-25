package com.example.parking_management.shortTermParking.parkingCapacity.model;

import com.example.parking_management.rate.vehicleType.model.VehicleType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "capacidad_parqueadero")
public class ParkingCapacity {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tipo_vehiculo_id", nullable = false, unique = true)
    private VehicleType vehicleType;

    @Column(name = "capacidad_total", nullable = false)
    private Integer totalCapacity;

    protected ParkingCapacity() {
    }

    public void updateTotalCapacity(int newCapacity) {
        if (newCapacity <= 0) {
            throw new IllegalArgumentException("La capacidad total debe ser positiva");
        }
        this.totalCapacity = newCapacity;
    }
}
