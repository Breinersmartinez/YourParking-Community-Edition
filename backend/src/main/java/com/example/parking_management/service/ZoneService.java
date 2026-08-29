package com.example.parking_management.service;

import com.example.parking_management.dto.zoneDTO.ZoneRequest;
import com.example.parking_management.dto.zoneDTO.ZoneResponse;
import com.example.parking_management.model.space.Level;
import com.example.parking_management.model.space.Zone;
import com.example.parking_management.repository.LevelRepository;
import com.example.parking_management.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final LevelRepository levelRepository;

    public ZoneService(ZoneRepository zoneRepository, LevelRepository levelRepository) {
        this.zoneRepository = zoneRepository;
        this.levelRepository = levelRepository;
    }

    public List<ZoneResponse> getAllZones() {
        return zoneRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ZoneResponse getZoneById(Long id) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zona no encontrada con ID: " + id));
        return convertToResponse(zone);
    }

    public List<ZoneResponse> getZonesByLevel(Long idPiso) {
        return zoneRepository.findByNivel_IdPiso(idPiso).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ZoneResponse createZone(ZoneRequest request) {
        Zone zone = Zone.builder()
                .nombreZona(request.getNombreZona())
                .descripcion(request.getDescripcion())
                .build();
        if (request.getIdPiso() != null) {
            Level level = levelRepository.findById(request.getIdPiso())
                    .orElseThrow(() -> new RuntimeException("Piso no encontrado con ID: " + request.getIdPiso()));
            zone.setNivel(level);
        }
        Zone saved = zoneRepository.save(zone);
        return convertToResponse(saved);
    }

    @Transactional
    public ZoneResponse updateZone(Long id, ZoneRequest request) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zona no encontrada con ID: " + id));
        if (request.getNombreZona() != null) {
            zone.setNombreZona(request.getNombreZona());
        }
        if (request.getDescripcion() != null) {
            zone.setDescripcion(request.getDescripcion());
        }
        if (request.getIdPiso() != null) {
            Level level = levelRepository.findById(request.getIdPiso())
                    .orElseThrow(() -> new RuntimeException("Piso no encontrado con ID: " + request.getIdPiso()));
            zone.setNivel(level);
        }
        Zone updated = zoneRepository.save(zone);
        return convertToResponse(updated);
    }

    @Transactional
    public void deleteZone(Long id) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zona no encontrada con ID: " + id));
        zoneRepository.delete(zone);
    }

    private ZoneResponse convertToResponse(Zone zone) {
        return ZoneResponse.builder()
                .idZona(zone.getIdZona())
                .nombreZona(zone.getNombreZona())
                .descripcion(zone.getDescripcion())
                .idPiso(zone.getNivel() != null ? zone.getNivel().getIdPiso() : null)
                .build();
    }
}
