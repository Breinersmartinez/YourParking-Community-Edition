package com.example.parking_management.security.role.service.impl;

import com.example.parking_management.security.permission.repository.PermissionRepository;
import com.example.parking_management.security.role.dto.RoleRequest;
import com.example.parking_management.security.role.dto.RoleResponse;
import com.example.parking_management.security.role.repository.RoleRepository;
import com.example.parking_management.security.role.service.RoleService;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public RoleResponse createRole(RoleRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public RoleResponse assignPermissions(Long roleId, Set<String> permissionCodes) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> listPermissions() {
        throw new UnsupportedOperationException("Sin implementar");
    }
}
