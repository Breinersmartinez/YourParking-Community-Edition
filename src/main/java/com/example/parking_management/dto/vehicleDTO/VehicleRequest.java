package com.example.parking_management.dto.vehicleDTO;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequest {
    private int vehicleId;
    private String plate; // PLACA_VEHICULO
    private String typeVehicle;
    //Marca del vehiculo
    private String brandVehicle;
    private String colorVehicle;
    private String propertyCard; // TARJTETA DE PROPIEDAD
    private LocalDateTime entryDate; // Fecha de entrada
    private LocalDateTime departureDate;
}
