package com.example.parking_management.security.user.dto;

import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String username,
    String roleName,
    Boolean active,
    LocalDateTime lastLogin
) {
}
