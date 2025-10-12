package com.example.parking_management.controller;


import com.example.parking_management.dto.vehicleDTO.VehicleRequest;
import com.example.parking_management.dto.vehicleDTO.VehicleResponse;
import com.example.parking_management.model.Vehicle;
import com.example.parking_management.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController

@RequestMapping(path = "api/vehicles")

public class VehicleController {

    @Autowired
    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        try {
            List<VehicleResponse> Vehilces = vehicleService.getAllVehicles();
            return ResponseEntity.ok(Vehilces);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/{vehicleId}")
    @PreAuthorize("hasRole('ADMIN') or #idCard == authentication.principal.idCard")
    public Optional<Vehicle> getById(@PathVariable("vehicleId") int vehicleId) {
        return vehicleService.getVehicle(vehicleId);
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> getAll(@RequestBody VehicleRequest request) {
        try {
            return ResponseEntity.ok(vehicleService.saveOrUpdate(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }


    }


    @DeleteMapping("/{vehicleId}")
    @PreAuthorize("hasRole('ADMIN') or #idCard == authentication.principal.idCard")
    public void saveOrUpdate(@PathVariable("vehicleId") int vehicleId) {
        vehicleService.delete(vehicleId);
    }

}
