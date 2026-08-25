package com.example.parking_management.monthlyPayment.period.repository;

import com.example.parking_management.monthlyPayment.period.model.Period;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PeriodRepository extends JpaRepository<Period, Long> {

    List<Period> findByMonthlyPaymentId(Long monthlyPaymentId);

    boolean existsByMonthlyPaymentIdAndYearMonth(Long monthlyPaymentId, LocalDate yearMonth);
}
