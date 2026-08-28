package com.example.parking_management.model.space;

import com.example.parking_management.audit.Auditable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PISO")
public class Level extends Auditable<Level> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PISO")
    private Long idPiso;

    @Column(name = "NUMERO_PISO", nullable = false, unique = true)
    private Integer numeroPiso;

    @Column(name = "CAPACIDAD_TOTAL")
    private Integer capacidadTotal;

    @Column(name = "ESPACIOS_DISPONIBLES")
    private Integer espaciosDisponibles;

    @OneToMany(mappedBy = "nivel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Space> espacios = new ArrayList<>();
}
