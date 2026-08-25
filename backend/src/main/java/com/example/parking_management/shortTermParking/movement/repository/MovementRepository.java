package com.example.parking_management.shortTermParking.movement.repository;

import com.example.parking_management.shortTermParking.movement.model.Movement;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovementRepository extends JpaRepository<Movement, Long> {

    List<Movement> findByExitTimeIsNull();

    long countByVehicleTypeIdAndExitTimeIsNullAndMonthlyCustomerFalse(Long vehicleTypeId);

    List<Movement> findByVehicleIdOrderByEntryTimeDesc(Long vehicleId);
}
