package com.example.parking_management.rate.vehicleType.repository;

import com.example.parking_management.rate.vehicleType.model.VehicleType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long> {

    Optional<VehicleType> findByName(String name);

    List<VehicleType> findByActiveTrue();
}
