package com.example.parking_management.service;

import com.example.parking_management.dto.vehicleDTO.VehicleRequest;
import com.example.parking_management.dto.vehicleDTO.VehicleResponse;
import com.example.parking_management.model.user.User;
import com.example.parking_management.model.vehicles.Vehicle;
import com.example.parking_management.repository.UserRepository;
import com.example.parking_management.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleService(VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<VehicleResponse> getVehiclesByOwner(Integer idCard) {
        return vehicleRepository.findByOwner_IdCard(idCard)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Optional<Vehicle> getVehicle(String plate) {
        return vehicleRepository.findByPlate(plate);
    }

    @Transactional
    public VehicleResponse saveOrUpdate(VehicleRequest request) {
        if (vehicleRepository.findByPlate(request.getPlate()).isPresent()) {
            throw new RuntimeException("El Vehiculo ya está registrado");
        }

        Vehicle vehicle = Vehicle.builder()
                .plate(request.getPlate())
                .typeVehicle(request.getTypeVehicle())
                .brandVehicle(request.getBrandVehicle())
                .colorVehicle(request.getColorVehicle())
                .departureDate(request.getDepartureDate())
                .propertyCard(request.getPropertyCard())
                .entryDate(request.getEntryDate())
                .build();

        if (request.getOwnerIdCard() != null) {
            User owner = userRepository.findById(request.getOwnerIdCard())
                    .orElseThrow(() -> new RuntimeException("Usuario propietario no encontrado con ID: " + request.getOwnerIdCard()));
            vehicle.setOwner(owner);
        }

        vehicleRepository.save(vehicle);

        return VehicleResponse.builder()
                .plate(vehicle.getPlate())
                .typeVehicle(vehicle.getTypeVehicle())
                .brandVehicle(vehicle.getBrandVehicle())
                .colorVehicle(vehicle.getColorVehicle())
                .departureDate(vehicle.getDepartureDate())
                .propertyCard(vehicle.getPropertyCard())
                .entryDate(vehicle.getEntryDate())
                .ownerIdCard(vehicle.getOwner() != null ? vehicle.getOwner().getIdCard() : null)
                .build();
    }

    @Transactional
    public VehicleResponse update(String plate, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findByPlate(plate)
                .orElseThrow(() -> new RuntimeException("El Vehiculo no existe con placa: " + plate));

        vehicle.setTypeVehicle(request.getTypeVehicle());
        vehicle.setBrandVehicle(request.getBrandVehicle());
        vehicle.setColorVehicle(request.getColorVehicle());
        vehicle.setPropertyCard(request.getPropertyCard());
        vehicle.setEntryDate(request.getEntryDate());
        vehicle.setDepartureDate(request.getDepartureDate());

        if (request.getOwnerIdCard() != null) {
            User owner = userRepository.findById(request.getOwnerIdCard())
                    .orElseThrow(() -> new RuntimeException("Usuario propietario no encontrado con ID: " + request.getOwnerIdCard()));
            vehicle.setOwner(owner);
        }

        vehicleRepository.save(vehicle);
        return convertToResponse(vehicle);
    }

    @Transactional
    public void delete(String plate) {
        vehicleRepository.deleteByPlate(plate);
    }

    // Convertir Vehicle a VehicleResponse
    private VehicleResponse convertToResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .plate(vehicle.getPlate())
                .typeVehicle(vehicle.getTypeVehicle())
                .brandVehicle(vehicle.getBrandVehicle())
                .colorVehicle(vehicle.getColorVehicle())
                .departureDate(vehicle.getDepartureDate())
                .propertyCard(vehicle.getPropertyCard())
                .entryDate(vehicle.getEntryDate())
                .ownerIdCard(vehicle.getOwner() != null ? vehicle.getOwner().getIdCard() : null)
                .build();
    }
}
