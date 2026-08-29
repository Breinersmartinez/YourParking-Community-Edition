package com.example.parking_management.repository;

import com.example.parking_management.model.space.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findByNivel_IdPiso(Long idPiso);
}
