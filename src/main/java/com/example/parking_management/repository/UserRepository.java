package com.example.parking_management.repository;

import com.example.parking_management.model.User;


import com.example.parking_management.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    List<User> findByActive(Boolean active);
    List<User> findByRole(Role role);
}
