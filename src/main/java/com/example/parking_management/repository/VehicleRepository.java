package com.example.parking_management.repository;


import com.example.parking_management.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {

    Optional<Vehicle> findByPlate(String plate);

    Optional<Vehicle> deleteByPlate(String plate);
}
