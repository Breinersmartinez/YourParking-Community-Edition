package com.example.parking_management.security.role.dto;

import java.util.Set;

public record RoleResponse(
    Long id,
    String name,
    Set<String> permissions,
    Boolean active
) {
}
