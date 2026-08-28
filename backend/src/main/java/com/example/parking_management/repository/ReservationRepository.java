package com.example.parking_management.repository;

import com.example.parking_management.model.reservation.Reservation;
import com.example.parking_management.model.reservation.enums.ReservationState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUser_IdCard(Integer idCard);
    List<Reservation> findBySpace_IdEspacio(Long idEspacio);
    List<Reservation> findByEstado(ReservationState estado);
    boolean existsBySpace_IdEspacioAndEstadoIn(Long idEspacio, List<ReservationState> estados);
}
