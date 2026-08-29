package com.example.parking_management.controller;

import com.example.parking_management.dto.incidentDTO.IncidentRequest;
import com.example.parking_management.dto.incidentDTO.IncidentResponse;
import com.example.parking_management.model.incident.enums.IncidentState;
import com.example.parking_management.service.IncidentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<List<IncidentResponse>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(incidentService.getIncidentById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/state/{estado}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<List<IncidentResponse>> getIncidentsByState(@PathVariable IncidentState estado) {
        return ResponseEntity.ok(incidentService.getIncidentsByState(estado));
    }

    @GetMapping("/vehicle/{plate}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<List<IncidentResponse>> getIncidentsByPlate(@PathVariable String plate) {
        return ResponseEntity.ok(incidentService.getIncidentsByPlate(plate));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<IncidentResponse> createIncident(@RequestBody IncidentRequest request) {
        try {
            return ResponseEntity.ok(incidentService.createIncident(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/state")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<IncidentResponse> updateState(@PathVariable Long id, @RequestParam IncidentState estado) {
        try {
            return ResponseEntity.ok(incidentService.updateState(id, estado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        try {
            incidentService.deleteIncident(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
