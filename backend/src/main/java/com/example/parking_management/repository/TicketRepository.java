package com.example.parking_management.repository;

import com.example.parking_management.model.ticket.Ticket;
import com.example.parking_management.model.ticket.enums.TicketState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByState(TicketState state);
    List<Ticket> findByVehicle_Plate(String plate);
}
