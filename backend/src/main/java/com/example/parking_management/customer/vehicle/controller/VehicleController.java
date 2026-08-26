package com.example.parking_management.customer.vehicle.controller;

import com.example.parking_management.customer.vehicle.dto.ChangeOwnerRequest;
import com.example.parking_management.customer.vehicle.dto.VehicleRequest;
import com.example.parking_management.customer.vehicle.dto.VehicleResponse;
import com.example.parking_management.customer.vehicle.service.VehicleService;
import com.example.parking_management.shared.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vehiculos")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleResponse>> create(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleService.createVehicle(request), "Vehículo registrado"));
    }

    @PutMapping("/{id}/cliente")
    public ResponseEntity<ApiResponse<VehicleResponse>> changeOwner(
        @PathVariable Long id, @Valid @RequestBody ChangeOwnerRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleService.changeOwner(id, request)));
    }

    @GetMapping(params = "placa")
    public ResponseEntity<ApiResponse<VehicleResponse>> getByPlate(@RequestParam String placa) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleService.getByLicensePlate(placa)));
    }
}
