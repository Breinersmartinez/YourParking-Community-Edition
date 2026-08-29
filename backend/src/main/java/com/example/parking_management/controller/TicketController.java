package com.example.parking_management.controller;

import com.example.parking_management.dto.ticketDTO.TicketCloseRequest;
import com.example.parking_management.dto.ticketDTO.TicketRequest;
import com.example.parking_management.dto.ticketDTO.TicketResponse;
import com.example.parking_management.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ticketService.getTicketById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/vehicle/{plate}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SUPERVISOR')")
    public ResponseEntity<List<TicketResponse>> getTicketsByPlate(@PathVariable String plate) {
        return ResponseEntity.ok(ticketService.getTicketsByPlate(plate));
    }

    // Registro de entrada de un vehículo
    @PostMapping("/entry")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<TicketResponse> registerEntry(@RequestBody TicketRequest request) {
        try {
            return ResponseEntity.ok(ticketService.registerEntry(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Registro de salida de un vehículo
    @PostMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<TicketResponse> closeTicket(@PathVariable Long id, @RequestBody(required = false) TicketCloseRequest request) {
        try {
            TicketCloseRequest req = request != null ? request : new TicketCloseRequest();
            return ResponseEntity.ok(ticketService.closeTicket(id, req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<TicketResponse> cancelTicket(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ticketService.cancelTicket(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
