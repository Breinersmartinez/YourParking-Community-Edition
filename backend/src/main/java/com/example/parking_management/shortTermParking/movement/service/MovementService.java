package com.example.parking_management.shortTermParking.movement.service;

import com.example.parking_management.shortTermParking.movement.dto.MovementResponse;
import com.example.parking_management.shortTermParking.movement.dto.RegisterEntryRequest;
import com.example.parking_management.shortTermParking.movement.dto.RegisterExitRequest;
import java.util.List;

public interface MovementService {

    MovementResponse registerEntry(RegisterEntryRequest request);

    MovementResponse registerExit(Long movementId, RegisterExitRequest request);

    void annulMovement(Long movementId);

    List<MovementResponse> listVehiclesWithoutExit();
}
