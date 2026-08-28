package com.example.parking_management.repository;

import com.example.parking_management.model.rate.Rate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RateRepository extends JpaRepository<Rate, Long> {
    Optional<Rate> findByTipoVehiculoAndFechaVigenciaFinIsNull(String tipoVehiculo);
    List<Rate> findByTipoVehiculo(String tipoVehiculo);
    List<Rate> findByFechaVigenciaInicioLessThanEqualAndFechaVigenciaFinGreaterThanEqual(LocalDate fecha, LocalDate fecha2);
}
