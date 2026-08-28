package com.example.parking_management.controller;

import com.example.parking_management.dto.zoneDTO.ZoneRequest;
import com.example.parking_management.dto.zoneDTO.ZoneResponse;
import com.example.parking_management.service.ZoneService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
@CrossOrigin(origins = "*")
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<List<ZoneResponse>> getAllZones() {
        return ResponseEntity.ok(zoneService.getAllZones());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<ZoneResponse> getZoneById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(zoneService.getZoneById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/level/{idPiso}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<List<ZoneResponse>> getZonesByLevel(@PathVariable Long idPiso) {
        return ResponseEntity.ok(zoneService.getZonesByLevel(idPiso));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ZoneResponse> createZone(@RequestBody ZoneRequest request) {
        try {
            return ResponseEntity.ok(zoneService.createZone(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ZoneResponse> updateZone(@PathVariable Long id, @RequestBody ZoneRequest request) {
        try {
            return ResponseEntity.ok(zoneService.updateZone(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteZone(@PathVariable Long id) {
        try {
            zoneService.deleteZone(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
