package com.example.parking_management.customer.vehicleHistory.repository;

import com.example.parking_management.customer.vehicleHistory.model.CustomerVehicleHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerVehicleHistoryRepository extends JpaRepository<CustomerVehicleHistory, Long> {

    List<CustomerVehicleHistory> findByVehicleIdOrderByStartDateDesc(Long vehicleId);
}
