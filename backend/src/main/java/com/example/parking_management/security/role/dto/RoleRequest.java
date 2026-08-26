package com.example.parking_management.security.role.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Set;

public record RoleRequest(
    @NotBlank String name,
    Set<String> permissionCodes
) {
}
