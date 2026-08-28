package com.example.parking_management.controller;

import com.example.parking_management.dto.reservationDTO.ReservationRequest;
import com.example.parking_management.dto.reservationDTO.ReservationResponse;
import com.example.parking_management.model.reservation.enums.ReservationState;
import com.example.parking_management.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'USER')")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(reservationService.getReservationById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{idCard}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR', 'USER')")
    public ResponseEntity<List<ReservationResponse>> getReservationsByUser(@PathVariable Integer idCard) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(idCard));
    }

    @GetMapping("/space/{idEspacio}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<List<ReservationResponse>> getReservationsBySpace(@PathVariable Long idEspacio) {
        return ResponseEntity.ok(reservationService.getReservationsBySpace(idEspacio));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ReservationResponse> createReservation(@RequestBody ReservationRequest request) {
        try {
            return ResponseEntity.ok(reservationService.createReservation(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/state")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<ReservationResponse> updateState(@PathVariable Long id, @RequestParam ReservationState estado) {
        try {
            return ResponseEntity.ok(reservationService.updateState(id, estado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        try {
            reservationService.deleteReservation(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
