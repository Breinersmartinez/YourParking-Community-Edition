package com.example.parking_management.service;

import com.example.parking_management.dto.vehicleDTO.VehicleRequest;
import com.example.parking_management.dto.vehicleDTO.VehicleResponse;
import com.example.parking_management.model.Vehicle;
import com.example.parking_management.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    VehicleRepository vehicleRepository;

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    public Optional<Vehicle> getVehicle(String plate) {
        return vehicleRepository.findByPlate(plate);
    }


    public VehicleResponse saveOrUpdate(VehicleRequest request) {
        // Verificar si el email ya existe

        if (vehicleRepository.findByPlate(request.getPlate()).isPresent()) {
            throw new RuntimeException("El Vehiculo ya está registrado");
        }

        // mapeo request - entidad
        Vehicle vehicle = Vehicle.builder()
                .plate(request.getPlate())
                .typeVehicle(request.getTypeVehicle())
                .brandVehicle(request.getBrandVehicle())
                .colorVehicle(request.getColorVehicle())
                .departureDate(request.getDepartureDate())
                .propertyCard(request.getPropertyCard())
                .entryDate(request.getEntryDate())
                .build();
        //guardar
        vehicleRepository.save(vehicle);

        //Retornar dto
        return VehicleResponse.builder()
                .plate(vehicle.getPlate())
                .typeVehicle(vehicle.getTypeVehicle())
                .brandVehicle(vehicle.getBrandVehicle())
                .colorVehicle(vehicle.getColorVehicle())
                .departureDate(vehicle.getDepartureDate())
                .propertyCard(vehicle.getPropertyCard())
                .entryDate(vehicle.getEntryDate())
                .build();
    }

    public void delete(String plate) {
        vehicleRepository.deleteByPlate(plate);
    }


    // Convertir Vehicle a VehicleResponse
    private VehicleResponse convertToResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .plate(vehicle.getPlate())
                .brandVehicle(vehicle.getBrandVehicle())
                .colorVehicle(vehicle.getColorVehicle())
                .departureDate(vehicle.getDepartureDate())
                .propertyCard(vehicle.getPropertyCard())
                .entryDate(vehicle.getEntryDate())
                .build();


    }
}
