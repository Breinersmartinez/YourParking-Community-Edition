package com.example.parking_management.model;

import com.example.parking_management.audit.Auditable;
import jakarta.persistence.*;
import lombok.Builder;

import java.time.LocalDateTime;


@Entity
@Builder
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "VEHICULO")
public class Vehicle  extends Auditable<Vehicle> {
    @Id
    @Column(name = "PLACA_VEHICULO")
    private String plate; // PLACA_VEHICULO

    @Column(name = "TIPO_VEHICULO")
    private String typeVehicle;


    //Marca del vehiculo
    @Column(name = "MARCA_VEHICULO")
    private String brandVehicle;


    @Column(name = "COLOR_VEHICULO")
    private String colorVehicle;

    @Column(name = "TARJETA_PROPIEDAD")
    private String propertyCard; // TARJTETA DE PROPIEDAD

    @Column(name = "HORA_ENTRADA")
    private LocalDateTime entryDate; // Fecha de entrada

    @Column(name = "HORA_SALIDA")
    private LocalDateTime departureDate; // Fecha de salida


    public Vehicle(String plate, String typeVehicle, String brandVehicle, String colorVehicle, String propertyCard, LocalDateTime entryDate, LocalDateTime departureDate) {
        this.plate = plate;
        this.typeVehicle = typeVehicle;
        this.brandVehicle = brandVehicle;
        this.colorVehicle = colorVehicle;
        this.propertyCard = propertyCard;
        this.entryDate = entryDate;
        this.departureDate = departureDate;
    }

    public Vehicle() {

    }

    public String getTypeVehicle() {
        return typeVehicle;
    }

    public void setTypeVehicle(String typeVehicle) {
        this.typeVehicle = typeVehicle;
    }


    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public String getBrandVehicle() {
        return brandVehicle;
    }

    public void setBrandVehicle(String brandVehicle) {
        this.brandVehicle = brandVehicle;
    }

    public String getColorVehicle() {
        return colorVehicle;
    }

    public void setColorVehicle(String colorVehicle) {
        this.colorVehicle = colorVehicle;
    }

    public LocalDateTime getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDateTime entryDate) {
        this.entryDate = entryDate;
    }

    public String getPropertyCard() {
        return propertyCard;
    }

    public void setPropertyCard(String propertyCard) {
        this.propertyCard = propertyCard;
    }

    public LocalDateTime getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(LocalDateTime departureDate) {
        this.departureDate = departureDate;
    }
}
