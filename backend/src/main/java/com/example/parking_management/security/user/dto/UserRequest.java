package com.example.parking_management.security.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequest(
    @NotBlank
    @Size(min = 4, max = 50)
    String username,
    @NotBlank String password,
    @NotNull Long roleId
) {
}
