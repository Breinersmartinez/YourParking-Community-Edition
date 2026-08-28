package com.example.parking_management.repository;

import com.example.parking_management.model.space.Space;
import com.example.parking_management.model.space.enums.SpaceState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpaceRepository extends JpaRepository<Space, Long> {
    List<Space> findByEstado(SpaceState estado);
    List<Space> findByNivel_IdPiso(Long idPiso);
    List<Space> findByZona_IdZona(Long idZona);
    long countByEstado(SpaceState estado);
}
