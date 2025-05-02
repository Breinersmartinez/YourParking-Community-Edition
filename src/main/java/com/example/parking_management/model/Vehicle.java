package com.example.parking_management.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity

@Table(name = "Vehiculos")
public class Vehicle {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long vehicleId;
    private String TypeVehicle;
    //Marca del vehiculo
    private String brandVehicle;
    private String colorVehicle;


    @Column(name="PlacaVehiculo", unique = true, nullable = false)
    private String plate;



    private LocalDateTime entryDate; // Fecha de entrada
    private LocalDateTime departureDate; // Fecha de salida
}
