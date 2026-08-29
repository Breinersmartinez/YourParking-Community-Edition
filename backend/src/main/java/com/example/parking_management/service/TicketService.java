package com.example.parking_management.service;

import com.example.parking_management.dto.ticketDTO.TicketCloseRequest;
import com.example.parking_management.dto.ticketDTO.TicketRequest;
import com.example.parking_management.dto.ticketDTO.TicketResponse;
import com.example.parking_management.model.space.Space;
import com.example.parking_management.model.space.enums.SpaceState;
import com.example.parking_management.model.ticket.Ticket;
import com.example.parking_management.model.ticket.enums.TicketState;
import com.example.parking_management.model.vehicles.Vehicle;
import com.example.parking_management.repository.SpaceRepository;
import com.example.parking_management.repository.TicketRepository;
import com.example.parking_management.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final VehicleRepository vehicleRepository;
    private final SpaceRepository spaceRepository;
    private final RateService rateService;

    public TicketService(TicketRepository ticketRepository, VehicleRepository vehicleRepository,
                         SpaceRepository spaceRepository, RateService rateService) {
        this.ticketRepository = ticketRepository;
        this.vehicleRepository = vehicleRepository;
        this.spaceRepository = spaceRepository;
        this.rateService = rateService;
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado con ID: " + id));
        return convertToResponse(ticket);
    }

    public List<TicketResponse> getTicketsByPlate(String plate) {
        return ticketRepository.findByVehicle_Plate(plate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Registro de entrada
    @Transactional
    public TicketResponse registerEntry(TicketRequest request) {
        Vehicle vehicle = vehicleRepository.findByPlate(request.getPlate())
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado con placa: " + request.getPlate()));
        Space space = spaceRepository.findById(request.getIdEspacio())
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + request.getIdEspacio()));
        if (space.getEstado() != SpaceState.DISPONIBLE) {
            throw new RuntimeException("El espacio " + space.getNumeroEspacio() + " no está disponible");
        }

        Ticket ticket = Ticket.builder()
                .vehicle(vehicle)
                .space(space)
                .entryDate(request.getEntryDate() != null ? request.getEntryDate() : LocalDateTime.now())
                .state(TicketState.ACTIVO)
                .build();

        Ticket saved = ticketRepository.save(ticket);

        space.setEstado(SpaceState.OCUPADO);
        spaceRepository.save(space);

        return convertToResponse(saved);
    }

    // Registro de salida / cierre
    @Transactional
    public TicketResponse closeTicket(Long id, TicketCloseRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado con ID: " + id));
        if (ticket.getState() != TicketState.ACTIVO) {
            throw new RuntimeException("El ticket ya fue finalizado o cancelado");
        }

        LocalDateTime exit = request.getExitDate() != null ? request.getExitDate() : LocalDateTime.now();
        BigDecimal total = rateService.calculateCost(ticket.getVehicle().getTypeVehicle(), ticket.getEntryDate(), exit);

        ticket.close(exit, total);

        Ticket saved = ticketRepository.save(ticket);

        Space space = ticket.getSpace();
        if (space != null) {
            space.setEstado(SpaceState.DISPONIBLE);
            spaceRepository.save(space);
        }

        return convertToResponse(saved);
    }

    @Transactional
    public TicketResponse cancelTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado con ID: " + id));
        if (ticket.getState() != TicketState.ACTIVO) {
            throw new RuntimeException("Solo se pueden cancelar tickets activos");
        }
        ticket.setState(TicketState.CANCELADO);
        Ticket saved = ticketRepository.save(ticket);

        Space space = ticket.getSpace();
        if (space != null) {
            space.setEstado(SpaceState.DISPONIBLE);
            spaceRepository.save(space);
        }
        return convertToResponse(saved);
    }

    private TicketResponse convertToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .idTicket(ticket.getIdTicket())
                .plate(ticket.getVehicle() != null ? ticket.getVehicle().getPlate() : null)
                .idEspacio(ticket.getSpace() != null ? ticket.getSpace().getIdEspacio() : null)
                .entryDate(ticket.getEntryDate())
                .exitDate(ticket.getExitDate())
                .totalMinutes(ticket.getTotalMinutes())
                .totalAmount(ticket.getTotalAmount())
                .state(ticket.getState())
                .build();
    }
}
