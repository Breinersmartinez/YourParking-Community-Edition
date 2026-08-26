package com.example.parking_management.shortTermParking.movement.dto;

import java.time.LocalDateTime;

public record RegisterExitRequest(
    LocalDateTime exitTime
) {
}
