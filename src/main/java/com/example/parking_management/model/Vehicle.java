package com.example.parking_management.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Setter
@Getter
@Table(name = "VEHICULO")
public class Vehicle {
    @Id
    @Column (name = "ID_VEHICULO")
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int vehicleId;


    @Column (name = "PLACA_VEHICULO",  unique = true, nullable = false)
    private Long plate; // PLACA_VEHICULO


    //Marca del vehiculo
    @Column (name = "MARCA_VEHICULO")
    private String brandVehicle;


    @Column (name = "COLOR_VEHICULO")
    private String colorVehicle;

    @Column (name = "TARJETA_PROPIEDAD")
    private String propertyCard; // TARJTETA DE PROPIEDAD

    @Column (name = "HORA_ENTRADA")
    private LocalDateTime entryDate; // Fecha de entrada

    @Column (name = "HORA_SALIDA")
    private LocalDateTime departureDate; // Fecha de salida



    // ------------- Llaves foraneas ---------
    // Llave foranea
    @ManyToOne
    @JoinColumn (name = "IDENTIFICACION")
    private User user;

    // Llave Foranea
    @OneToOne
    @JoinColumn (name = "ID_TIPO_VEHICULO")
    private TypeVehicle typeVehicle;

}
