package com.example.parking_management.Entity;


import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name="Tarifas")
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdTarifa")
    private Long feeId;

    @Column(unique = true, nullable = false)
    private String typeVehicle;

    private Double hourValue;
    private Double dayValue;
}
