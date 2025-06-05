package com.example.parking_management.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TIPO_VEHICULO")
public class TypeVehicle {

    @Id
    @Column (name = "ID_TIPO_VEHICULO")
    private int IdTypeVehicle;

    @Column(name = "TIPO_VEHICULO")
    private String TypeVehicle;

/*
    // Llaves foraneas
    @OneToOne(mappedBy = "typeVehicle", cascade = CascadeType.ALL)
    private Vehicle vehicle;
*/
}
