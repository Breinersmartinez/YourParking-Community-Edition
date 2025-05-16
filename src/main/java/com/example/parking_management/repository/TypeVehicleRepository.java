package com.example.parking_management.repository;

import com.example.parking_management.model.TypeVehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypeVehicleRepository extends JpaRepository<TypeVehicle, Integer> {
}
