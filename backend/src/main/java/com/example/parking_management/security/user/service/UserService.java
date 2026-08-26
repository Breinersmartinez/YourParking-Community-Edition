package com.example.parking_management.security.user.service;

import com.example.parking_management.security.auth.dto.LoginRequest;
import com.example.parking_management.security.auth.dto.LoginResponse;
import com.example.parking_management.security.auth.dto.RefreshRequest;
import com.example.parking_management.security.user.dto.UserRequest;
import com.example.parking_management.security.user.dto.UserResponse;

public interface UserService {

    UserResponse createUser(UserRequest request);

    void deactivateUser(Long id);

    LoginResponse authenticate(LoginRequest request);

    LoginResponse refreshToken(RefreshRequest request);
}
