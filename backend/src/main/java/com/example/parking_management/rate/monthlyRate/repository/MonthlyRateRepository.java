package com.example.parking_management.rate.monthlyRate.repository;

import com.example.parking_management.rate.monthlyRate.model.MonthlyRate;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MonthlyRateRepository extends JpaRepository<MonthlyRate, Long> {

    @Query("""
        select r from MonthlyRate r
        where r.vehicleType.id = :vehicleTypeId
          and r.validFrom <= :date
          and (r.validUntil is null or r.validUntil >= :date)
        """)
    Optional<MonthlyRate> findCurrentRate(@Param("vehicleTypeId") Long vehicleTypeId,
                                          @Param("date") LocalDate date);
}
