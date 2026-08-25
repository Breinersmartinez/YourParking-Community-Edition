package com.example.parking_management.security.auth.dto;

import java.util.List;

public record LoginResponse(
    String accessToken,
    String refreshToken,
    List<String> roles,
    List<String> permissions
) {
}
