package com.example.parking_management.security.auth.controller;

import com.example.parking_management.security.auth.dto.LoginRequest;
import com.example.parking_management.security.auth.dto.LoginResponse;
import com.example.parking_management.security.auth.dto.RefreshRequest;
import com.example.parking_management.security.user.service.UserService;
import com.example.parking_management.shared.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(userService.authenticate(request), "Login exitoso"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(userService.refreshToken(request)));
    }
}
