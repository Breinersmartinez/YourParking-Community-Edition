package com.example.parking_management.shortTermParking.parkingCapacity.repository;

import com.example.parking_management.shortTermParking.parkingCapacity.model.ParkingCapacity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingCapacityRepository extends JpaRepository<ParkingCapacity, Long> {

    Optional<ParkingCapacity> findByVehicleTypeId(Long vehicleTypeId);
}
