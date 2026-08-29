package com.example.parking_management.service;

import com.example.parking_management.dto.reservationDTO.ReservationRequest;
import com.example.parking_management.dto.reservationDTO.ReservationResponse;
import com.example.parking_management.model.reservation.Reservation;
import com.example.parking_management.model.reservation.enums.ReservationState;
import com.example.parking_management.model.space.Space;
import com.example.parking_management.model.space.enums.SpaceState;
import com.example.parking_management.model.user.User;
import com.example.parking_management.repository.ReservationRepository;
import com.example.parking_management.repository.SpaceRepository;
import com.example.parking_management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final SpaceRepository spaceRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              UserRepository userRepository,
                              SpaceRepository spaceRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.spaceRepository = spaceRepository;
    }

    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ReservationResponse getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
        return convertToResponse(reservation);
    }

    public List<ReservationResponse> getReservationsByUser(Integer idCard) {
        return reservationRepository.findByUser_IdCard(idCard).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getReservationsBySpace(Long idEspacio) {
        return reservationRepository.findBySpace_IdEspacio(idEspacio).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request) {
        User user = userRepository.findById(request.getIdCard())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + request.getIdCard()));

        Space space = spaceRepository.findById(request.getIdEspacio())
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado con ID: " + request.getIdEspacio()));

        if (space.getEstado() != SpaceState.DISPONIBLE) {
            throw new RuntimeException("El espacio no está disponible para reservar");
        }

        // Verificar reservas activas sobre el espacio
        boolean tieneReservaActiva = reservationRepository
                .existsBySpace_IdEspacioAndEstadoIn(request.getIdEspacio(),
                        List.of(ReservationState.PENDIENTE, ReservationState.CONFIRMADA));
        if (tieneReservaActiva) {
            throw new RuntimeException("El espacio ya tiene una reserva activa");
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .space(space)
                .fechaHoraInicio(request.getFechaHoraInicio())
                .fechaHoraFin(request.getFechaHoraFin())
                .estado(ReservationState.PENDIENTE)
                .montoReserva(request.getMontoReserva())
                .build();

        Reservation saved = reservationRepository.save(reservation);

        space.setEstado(SpaceState.RESERVADO);
        spaceRepository.save(space);

        return convertToResponse(saved);
    }

    @Transactional
    public ReservationResponse updateState(Long id, ReservationState estado) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));

        ReservationState anterior = reservation.getEstado();
        reservation.setEstado(estado);
        Reservation saved = reservationRepository.save(reservation);

        // Liberar o reservar el espacio según el estado
        Space space = reservation.getSpace();
        if (space != null) {
            if (estado == ReservationState.CANCELADA || estado == ReservationState.CUMPLIDA) {
                space.setEstado(SpaceState.DISPONIBLE);
            } else if (estado == ReservationState.CONFIRMADA && anterior == ReservationState.PENDIENTE) {
                space.setEstado(SpaceState.RESERVADO);
            }
            spaceRepository.save(space);
        }

        return convertToResponse(saved);
    }

    @Transactional
    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
        Space space = reservation.getSpace();
        reservationRepository.delete(reservation);
        if (space != null) {
            space.setEstado(SpaceState.DISPONIBLE);
            spaceRepository.save(space);
        }
    }

    private ReservationResponse convertToResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .idReserva(reservation.getIdReserva())
                .idCard(reservation.getUser() != null ? reservation.getUser().getIdCard() : null)
                .idEspacio(reservation.getSpace() != null ? reservation.getSpace().getIdEspacio() : null)
                .fechaHoraInicio(reservation.getFechaHoraInicio())
                .fechaHoraFin(reservation.getFechaHoraFin())
                .estado(reservation.getEstado())
                .montoReserva(reservation.getMontoReserva())
                .build();
    }
}
