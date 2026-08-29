package com.example.parking_management.controller;

import com.example.parking_management.dto.levelDTO.LevelRequest;
import com.example.parking_management.dto.levelDTO.LevelResponse;
import com.example.parking_management.service.LevelService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/levels")
@CrossOrigin(origins = "*")
public class LevelController {

    private final LevelService levelService;

    public LevelController(LevelService levelService) {
        this.levelService = levelService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<List<LevelResponse>> getAllLevels() {
        return ResponseEntity.ok(levelService.getAllLevels());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE')")
    public ResponseEntity<LevelResponse> getLevelById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(levelService.getLevelById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LevelResponse> createLevel(@RequestBody LevelRequest request) {
        try {
            return ResponseEntity.ok(levelService.createLevel(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LevelResponse> updateLevel(@PathVariable Long id, @RequestBody LevelRequest request) {
        try {
            return ResponseEntity.ok(levelService.updateLevel(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLevel(@PathVariable Long id) {
        try {
            levelService.deleteLevel(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
