package com.example.parking_management.security.role.service;

import com.example.parking_management.security.role.dto.RoleRequest;
import com.example.parking_management.security.role.dto.RoleResponse;
import java.util.List;
import java.util.Set;

public interface RoleService {

    RoleResponse createRole(RoleRequest request);

    RoleResponse assignPermissions(Long roleId, Set<String> permissionCodes);

    List<String> listPermissions();
}
