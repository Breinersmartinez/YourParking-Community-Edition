package com.example.parking_management.service;

import com.example.parking_management.dto.spaceDTO.SpaceRequest;
import com.example.parking_management.dto.spaceDTO.SpaceResponse;
import com.example.parking_management.model.space.Level;
import com.example.parking_management.model.space.Space;
import com.example.parking_management.model.space.Zone;
import com.example.parking_management.model.space.enums.SpaceState;
import com.example.parking_management.repository.LevelRepository;
import com.example.parking_management.repository.SpaceRepository;
import com.example.parking_management.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final LevelRepository levelRepository;
    private final ZoneRepository zoneRepository;

    public SpaceService(SpaceRepository spaceRepository, LevelRepository levelRepository, ZoneRepository zoneRepository) {
        this.spaceRepository = spaceRepository;
        this.levelRepository = levelRepository;
        this.zoneRepository = zoneRepository;
    }

    public List<SpaceResponse> getAllSpaces() {
        return spaceRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public SpaceResponse getSpaceById(Long id) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + id));
        return convertToResponse(space);
    }

    public List<SpaceResponse> getSpacesByState(SpaceState state) {
        return spaceRepository.findByEstado(state).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<SpaceResponse> getSpacesByLevel(Long idPiso) {
        return spaceRepository.findByNivel_IdPiso(idPiso).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<SpaceResponse> getSpacesByZone(Long idZona) {
        return spaceRepository.findByZona_IdZona(idZona).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public long countAvailable() {
        return spaceRepository.countByEstado(SpaceState.DISPONIBLE);
    }

    @Transactional
    public SpaceResponse createSpace(SpaceRequest request) {
        Space space = Space.builder()
                .numeroEspacio(request.getNumeroEspacio())
                .estado(request.getEstado() != null ? request.getEstado() : SpaceState.DISPONIBLE)
                .tipoEspacio(request.getTipoEspacio())
                .dimensiones(request.getDimensiones())
                .build();
        if (request.getIdPiso() != null) {
            Level level = levelRepository.findById(request.getIdPiso())
                    .orElseThrow(() -> new RuntimeException("Piso no encontrado con ID: " + request.getIdPiso()));
            space.setNivel(level);
        }
        if (request.getIdZona() != null) {
            Zone zone = zoneRepository.findById(request.getIdZona())
                    .orElseThrow(() -> new RuntimeException("Zona no encontrada con ID: " + request.getIdZona()));
            space.setZona(zone);
        }
        Space saved = spaceRepository.save(space);
        return convertToResponse(saved);
    }

    @Transactional
    public SpaceResponse updateSpace(Long id, SpaceRequest request) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + id));
        if (request.getNumeroEspacio() != null) {
            space.setNumeroEspacio(request.getNumeroEspacio());
        }
        if (request.getEstado() != null) {
            space.setEstado(request.getEstado());
        }
        if (request.getTipoEspacio() != null) {
            space.setTipoEspacio(request.getTipoEspacio());
        }
        if (request.getDimensiones() != null) {
            space.setDimensiones(request.getDimensiones());
        }
        if (request.getIdPiso() != null) {
            space.setNivel(levelRepository.findById(request.getIdPiso())
                    .orElseThrow(() -> new RuntimeException("Piso no encontrado con ID: " + request.getIdPiso())));
        }
        if (request.getIdZona() != null) {
            space.setZona(zoneRepository.findById(request.getIdZona())
                    .orElseThrow(() -> new RuntimeException("Zona no encontrada con ID: " + request.getIdZona())));
        }
        Space updated = spaceRepository.save(space);
        return convertToResponse(updated);
    }

    @Transactional
    public SpaceResponse changeState(Long id, SpaceState state) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + id));
        space.setEstado(state);
        Space updated = spaceRepository.save(space);
        return convertToResponse(updated);
    }

    @Transactional
    public void deleteSpace(Long id) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + id));
        spaceRepository.delete(space);
    }

    private SpaceResponse convertToResponse(Space space) {
        return SpaceResponse.builder()
                .idEspacio(space.getIdEspacio())
                .numeroEspacio(space.getNumeroEspacio())
                .estado(space.getEstado())
                .tipoEspacio(space.getTipoEspacio())
                .dimensiones(space.getDimensiones())
                .idPiso(space.getNivel() != null ? space.getNivel().getIdPiso() : null)
                .idZona(space.getZona() != null ? space.getZona().getIdZona() : null)
                .build();
    }
}
