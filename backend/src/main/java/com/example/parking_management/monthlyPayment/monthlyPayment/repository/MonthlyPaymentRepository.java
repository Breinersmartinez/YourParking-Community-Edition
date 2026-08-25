package com.example.parking_management.monthlyPayment.monthlyPayment.repository;

import com.example.parking_management.monthlyPayment.monthlyPayment.model.MonthlyPayment;
import com.example.parking_management.monthlyPayment.monthlyPayment.model.MonthlyPaymentStatus;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MonthlyPaymentRepository extends JpaRepository<MonthlyPayment, Long> {

    Optional<MonthlyPayment> findByVehicleIdAndState(Long vehicleId, MonthlyPaymentStatus state);

    Page<MonthlyPayment> findByState(MonthlyPaymentStatus state, Pageable pageable);

    @Query("""
        select count(m) from MonthlyPayment m
        where m.state = :state and m.vehicle.vehicleType.id = :vehicleTypeId
        """)
    long countByStateAndVehicleTypeId(@Param("state") MonthlyPaymentStatus state,
                                      @Param("vehicleTypeId") Long vehicleTypeId);
}
