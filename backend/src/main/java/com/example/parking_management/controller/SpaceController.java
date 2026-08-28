package com.example.parking_management.controller;

import com.example.parking_management.dto.spaceDTO.SpaceRequest;
import com.example.parking_management.dto.spaceDTO.SpaceResponse;
import com.example.parking_management.model.space.enums.SpaceState;
import com.example.parking_management.service.SpaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spaces")
@CrossOrigin(origins = "*")
public class SpaceController {

    private final SpaceService spaceService;

    public SpaceController(SpaceService spaceService) {
        this.spaceService = spaceService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE', 'USER')")
    public ResponseEntity<List<SpaceResponse>> getAllSpaces() {
        return ResponseEntity.ok(spaceService.getAllSpaces());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE', 'USER')")
    public ResponseEntity<SpaceResponse> getSpaceById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(spaceService.getSpaceById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/state/{state}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<List<SpaceResponse>> getSpacesByState(@PathVariable SpaceState state) {
        return ResponseEntity.ok(spaceService.getSpacesByState(state));
    }

    @GetMapping("/level/{idPiso}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<List<SpaceResponse>> getSpacesByLevel(@PathVariable Long idPiso) {
        return ResponseEntity.ok(spaceService.getSpacesByLevel(idPiso));
    }

    @GetMapping("/zone/{idZona}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<List<SpaceResponse>> getSpacesByZone(@PathVariable Long idZona) {
        return ResponseEntity.ok(spaceService.getSpacesByZone(idZona));
    }

    @GetMapping("/available/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE', 'USER')")
    public ResponseEntity<Long> countAvailable() {
        return ResponseEntity.ok(spaceService.countAvailable());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpaceResponse> createSpace(@RequestBody SpaceRequest request) {
        try {
            return ResponseEntity.ok(spaceService.createSpace(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpaceResponse> updateSpace(@PathVariable Long id, @RequestBody SpaceRequest request) {
        try {
            return ResponseEntity.ok(spaceService.updateSpace(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/state")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<SpaceResponse> changeState(@PathVariable Long id, @RequestParam SpaceState state) {
        try {
            return ResponseEntity.ok(spaceService.changeState(id, state));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSpace(@PathVariable Long id) {
        try {
            spaceService.deleteSpace(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
