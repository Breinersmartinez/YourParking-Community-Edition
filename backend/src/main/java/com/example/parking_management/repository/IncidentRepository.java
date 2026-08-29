package com.example.parking_management.repository;

import com.example.parking_management.model.incident.Incident;
import com.example.parking_management.model.incident.enums.IncidentState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByEstado(IncidentState estado);
    List<Incident> findByVehicle_Plate(String plate);
    List<Incident> findBySpace_IdEspacio(Long idEspacio);
}
