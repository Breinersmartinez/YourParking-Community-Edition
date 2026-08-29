package com.example.parking_management.service;

import com.example.parking_management.dto.rateDTO.RateRequest;
import com.example.parking_management.dto.rateDTO.RateResponse;
import com.example.parking_management.model.rate.Rate;
import com.example.parking_management.repository.RateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RateService {

    private final RateRepository rateRepository;

    public RateService(RateRepository rateRepository) {
        this.rateRepository = rateRepository;
    }

    public List<RateResponse> getAllRates() {
        return rateRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public RateResponse getRateById(Long id) {
        Rate rate = rateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarifa no encontrada con ID: " + id));
        return convertToResponse(rate);
    }

    public Rate getRateActiveByType(String tipoVehiculo) {
        Rate rate = rateRepository.findByTipoVehiculoAndFechaVigenciaFinIsNull(tipoVehiculo)
                .orElseGet(() -> rateRepository.findByTipoVehiculo(tipoVehiculo).stream()
                        .filter(r -> r.getFechaVigenciaInicio() == null
                                || !r.getFechaVigenciaInicio().isAfter(LocalDate.now()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("No hay tarifa activa para el tipo de vehículo: " + tipoVehiculo)));
        return rate;
    }

    @Transactional
    public RateResponse createRate(RateRequest request) {
        Rate rate = Rate.builder()
                .tipoVehiculo(request.getTipoVehiculo())
                .precioHora(request.getPrecioHora())
                .precioFraccion(request.getPrecioFraccion())
                .precioDia(request.getPrecioDia())
                .precioMes(request.getPrecioMes())
                .precioAnio(request.getPrecioAnio())
                .fechaVigenciaInicio(request.getFechaVigenciaInicio())
                .fechaVigenciaFin(request.getFechaVigenciaFin())
                .build();
        Rate saved = rateRepository.save(rate);
        return convertToResponse(saved);
    }

    @Transactional
    public RateResponse updateRate(Long id, RateRequest request) {
        Rate rate = rateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarifa no encontrada con ID: " + id));
        if (request.getTipoVehiculo() != null) {
            rate.setTipoVehiculo(request.getTipoVehiculo());
        }
        if (request.getPrecioHora() != null) {
            rate.setPrecioHora(request.getPrecioHora());
        }
        if (request.getPrecioFraccion() != null) {
            rate.setPrecioFraccion(request.getPrecioFraccion());
        }
        if (request.getPrecioDia() != null) {
            rate.setPrecioDia(request.getPrecioDia());
        }
        if (request.getPrecioMes() != null) {
            rate.setPrecioMes(request.getPrecioMes());
        }
        if (request.getPrecioAnio() != null) {
            rate.setPrecioAnio(request.getPrecioAnio());
        }
        if (request.getFechaVigenciaInicio() != null) {
            rate.setFechaVigenciaInicio(request.getFechaVigenciaInicio());
        }
        if (request.getFechaVigenciaFin() != null) {
            rate.setFechaVigenciaFin(request.getFechaVigenciaFin());
        }
        Rate updated = rateRepository.save(rate);
        return convertToResponse(updated);
    }

    @Transactional
    public void deleteRate(Long id) {
        Rate rate = rateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarifa no encontrada con ID: " + id));
        rateRepository.delete(rate);
    }

    // Calcula el costo de un registro de parqueo según la tarifa activa del tipo de vehículo
    public BigDecimal calculateCost(String tipoVehiculo, LocalDateTime entry, LocalDateTime exit) {
        Rate rate = getRateActiveByType(tipoVehiculo);
        if (entry == null || exit == null || !exit.isAfter(entry)) {
            throw new RuntimeException("Fechas de entrada/salida inválidas");
        }
        long minutes = Duration.between(entry, exit).toMinutes();
        if (minutes < 1) {
            minutes = 1;
        }
        BigDecimal cost;
        if (rate.getPrecioHora() != null) {
            cost = rate.getPrecioHora()
                    .multiply(BigDecimal.valueOf(minutes))
                    .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        } else {
            cost = BigDecimal.ZERO;
        }
        return cost;
    }

    private RateResponse convertToResponse(Rate rate) {
        return RateResponse.builder()
                .idTarifa(rate.getIdTarifa())
                .tipoVehiculo(rate.getTipoVehiculo())
                .precioHora(rate.getPrecioHora())
                .precioFraccion(rate.getPrecioFraccion())
                .precioDia(rate.getPrecioDia())
                .precioMes(rate.getPrecioMes())
                .precioAnio(rate.getPrecioAnio())
                .fechaVigenciaInicio(rate.getFechaVigenciaInicio())
                .fechaVigenciaFin(rate.getFechaVigenciaFin())
                .build();
    }
}
