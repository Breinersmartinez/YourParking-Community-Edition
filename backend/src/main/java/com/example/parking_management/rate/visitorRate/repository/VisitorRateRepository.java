package com.example.parking_management.rate.visitorRate.repository;

import com.example.parking_management.rate.visitorRate.model.VisitorRate;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VisitorRateRepository extends JpaRepository<VisitorRate, Long> {

    @Query("""
        select r from VisitorRate r
        where r.vehicleType.id = :vehicleTypeId
          and r.validFrom <= :date
          and (r.validUntil is null or r.validUntil >= :date)
        """)
    Optional<VisitorRate> findCurrentRate(@Param("vehicleTypeId") Long vehicleTypeId,
                                          @Param("date") LocalDate date);
}
