package com.example.parking_management.model.vehicles;

import com.example.parking_management.audit.Auditable;
import com.example.parking_management.model.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "VEHICULO")
public class Vehicle extends Auditable<Vehicle> {

    @Id
    @Column(name = "PLACA_VEHICULO")
    private String plate;

    @Column(name = "TIPO_VEHICULO")
    private String typeVehicle;

    @Column(name = "MARCA_VEHICULO")
    private String brandVehicle;

    @Column(name = "COLOR_VEHICULO")
    private String colorVehicle;

    @Column(name = "TARJETA_PROPIEDAD")
    private String propertyCard;

    @Column(name = "HORA_ENTRADA")
    private LocalDateTime entryDate;

    @Column(name = "HORA_SALIDA")
    private LocalDateTime departureDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO")
    private User owner;
}
