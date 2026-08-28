package com.example.parking_management.service;

import com.example.parking_management.dto.incidentDTO.IncidentRequest;
import com.example.parking_management.dto.incidentDTO.IncidentResponse;
import com.example.parking_management.model.incident.Incident;
import com.example.parking_management.model.incident.enums.IncidentState;
import com.example.parking_management.model.space.Space;
import com.example.parking_management.model.vehicles.Vehicle;
import com.example.parking_management.repository.IncidentRepository;
import com.example.parking_management.repository.SpaceRepository;
import com.example.parking_management.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final SpaceRepository spaceRepository;
    private final VehicleRepository vehicleRepository;

    public IncidentService(IncidentRepository incidentRepository,
                           SpaceRepository spaceRepository,
                           VehicleRepository vehicleRepository) {
        this.incidentRepository = incidentRepository;
        this.spaceRepository = spaceRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<IncidentResponse> getAllIncidents() {
        return incidentRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public IncidentResponse getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incidente no encontrado con ID: " + id));
        return convertToResponse(incident);
    }

    public List<IncidentResponse> getIncidentsByState(IncidentState estado) {
        return incidentRepository.findByEstado(estado).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<IncidentResponse> getIncidentsByPlate(String plate) {
        return incidentRepository.findByVehicle_Plate(plate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public IncidentResponse createIncident(IncidentRequest request) {
        Incident incident = Incident.builder()
                .fechaHora(request.getFechaHora() != null ? request.getFechaHora() : LocalDateTime.now())
                .tipoIncidente(request.getTipoIncidente())
                .descripcion(request.getDescripcion())
                .estado(IncidentState.REPORTADO)
                .build();

        if (request.getIdEspacio() != null) {
            Space space = spaceRepository.findById(request.getIdEspacio())
                    .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + request.getIdEspacio()));
            incident.setSpace(space);
        }
        if (request.getPlate() != null) {
            Vehicle vehicle = vehicleRepository.findByPlate(request.getPlate())
                    .orElseThrow(() -> new RuntimeException("Vehículo no encontrado con placa: " + request.getPlate()));
            incident.setVehicle(vehicle);
        }

        Incident saved = incidentRepository.save(incident);
        return convertToResponse(saved);
    }

    @Transactional
    public IncidentResponse updateState(Long id, IncidentState estado) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incidente no encontrado con ID: " + id));
        incident.setEstado(estado);
        Incident saved = incidentRepository.save(incident);
        return convertToResponse(saved);
    }

    @Transactional
    public void deleteIncident(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incidente no encontrado con ID: " + id));
        incidentRepository.delete(incident);
    }

    private IncidentResponse convertToResponse(Incident incident) {
        return IncidentResponse.builder()
                .idIncidente(incident.getIdIncidente())
                .idEspacio(incident.getSpace() != null ? incident.getSpace().getIdEspacio() : null)
                .plate(incident.getVehicle() != null ? incident.getVehicle().getPlate() : null)
                .fechaHora(incident.getFechaHora())
                .tipoIncidente(incident.getTipoIncidente())
                .descripcion(incident.getDescripcion())
                .estado(incident.getEstado())
                .build();
    }
}
