package com.example.parking_management.service;

import com.example.parking_management.dto.levelDTO.LevelRequest;
import com.example.parking_management.dto.levelDTO.LevelResponse;
import com.example.parking_management.model.space.Level;
import com.example.parking_management.repository.LevelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LevelService {

    private final LevelRepository levelRepository;

    public LevelService(LevelRepository levelRepository) {
        this.levelRepository = levelRepository;
    }

    public List<LevelResponse> getAllLevels() {
        return levelRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public LevelResponse getLevelById(Long id) {
        Level level = levelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Piso no encontrado con ID: " + id));
        return convertToResponse(level);
    }

    @Transactional
    public LevelResponse createLevel(LevelRequest request) {
        if (levelRepository.findByNumeroPiso(request.getNumeroPiso()).isPresent()) {
            throw new RuntimeException("Ya existe un piso con el número: " + request.getNumeroPiso());
        }
        Level level = Level.builder()
                .numeroPiso(request.getNumeroPiso())
                .capacidadTotal(request.getCapacidadTotal() != null ? request.getCapacidadTotal() : 0)
                .espaciosDisponibles(request.getEspaciosDisponibles() != null ? request.getEspaciosDisponibles() : 0)
                .build();
        Level saved = levelRepository.save(level);
        return convertToResponse(saved);
    }

    @Transactional
    public LevelResponse updateLevel(Long id, LevelRequest request) {
        Level level = levelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Piso no encontrado con ID: " + id));
        if (request.getNumeroPiso() != null) {
            level.setNumeroPiso(request.getNumeroPiso());
        }
        if (request.getCapacidadTotal() != null) {
            level.setCapacidadTotal(request.getCapacidadTotal());
        }
        if (request.getEspaciosDisponibles() != null) {
            level.setEspaciosDisponibles(request.getEspaciosDisponibles());
        }
        Level updated = levelRepository.save(level);
        return convertToResponse(updated);
    }

    @Transactional
    public void deleteLevel(Long id) {
        Level level = levelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Piso no encontrado con ID: " + id));
        levelRepository.delete(level);
    }

    private LevelResponse convertToResponse(Level level) {
        return LevelResponse.builder()
                .idPiso(level.getIdPiso())
                .numeroPiso(level.getNumeroPiso())
                .capacidadTotal(level.getCapacidadTotal())
                .espaciosDisponibles(level.getEspaciosDisponibles())
                .build();
    }
}
