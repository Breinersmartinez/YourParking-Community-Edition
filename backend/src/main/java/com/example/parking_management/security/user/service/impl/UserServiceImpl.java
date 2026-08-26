package com.example.parking_management.security.user.service.impl;

import com.example.parking_management.security.auth.dto.LoginRequest;
import com.example.parking_management.security.auth.dto.LoginResponse;
import com.example.parking_management.security.auth.dto.RefreshRequest;
import com.example.parking_management.security.role.repository.RoleRepository;
import com.example.parking_management.security.user.dto.UserRequest;
import com.example.parking_management.security.user.dto.UserResponse;
import com.example.parking_management.security.user.repository.UserRepository;
import com.example.parking_management.security.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public UserResponse createUser(UserRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public void deactivateUser(Long id) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public LoginResponse authenticate(LoginRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public LoginResponse refreshToken(RefreshRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }
}
