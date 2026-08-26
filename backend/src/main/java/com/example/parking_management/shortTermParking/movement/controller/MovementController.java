package com.example.parking_management.shortTermParking.movement.controller;

import com.example.parking_management.shortTermParking.movement.dto.MovementResponse;
import com.example.parking_management.shortTermParking.movement.dto.RegisterEntryRequest;
import com.example.parking_management.shortTermParking.movement.dto.RegisterExitRequest;
import com.example.parking_management.shortTermParking.movement.service.MovementService;
import com.example.parking_management.shared.response.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movimientos")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @PostMapping("/ingreso")
    public ResponseEntity<ApiResponse<MovementResponse>> registerEntry(
        @Valid @RequestBody RegisterEntryRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(movementService.registerEntry(request), "Ingreso registrado"));
    }

    @PutMapping("/{id}/salida")
    public ResponseEntity<ApiResponse<MovementResponse>> registerExit(
        @PathVariable Long id, @Valid @RequestBody RegisterExitRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(movementService.registerExit(id, request)));
    }

    @GetMapping("/sin-salida")
    public ResponseEntity<ApiResponse<List<MovementResponse>>> withoutExit() {
        return ResponseEntity.ok(ApiResponse.ok(movementService.listVehiclesWithoutExit()));
    }
}
