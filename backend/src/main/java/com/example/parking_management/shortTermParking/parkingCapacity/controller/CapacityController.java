package com.example.parking_management.shortTermParking.parkingCapacity.controller;

import com.example.parking_management.shortTermParking.parkingCapacity.dto.CapacityRequest;
import com.example.parking_management.shortTermParking.parkingCapacity.dto.CapacityResponse;
import com.example.parking_management.shortTermParking.parkingCapacity.dto.OccupancyResponse;
import com.example.parking_management.shortTermParking.parkingCapacity.service.ParkingCapacityService;
import com.example.parking_management.shared.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/capacidad")
public class CapacityController {

    private final ParkingCapacityService parkingCapacityService;

    public CapacityController(ParkingCapacityService parkingCapacityService) {
        this.parkingCapacityService = parkingCapacityService;
    }

    @PutMapping
    @PreAuthorize("hasAuthority('CAPACIDAD_UPDATE')")
    public ResponseEntity<ApiResponse<CapacityResponse>> configure(
        @Valid @RequestBody CapacityRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(parkingCapacityService.configureCapacity(request)));
    }

    @GetMapping("/ocupacion")
    public ResponseEntity<ApiResponse<OccupancyResponse>> occupancy() {
        return ResponseEntity.ok(ApiResponse.ok(parkingCapacityService.getOccupancy()));
    }
}
