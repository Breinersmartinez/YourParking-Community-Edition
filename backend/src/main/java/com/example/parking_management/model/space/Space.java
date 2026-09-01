package com.example.parking_management.model.space;

import com.example.parking_management.audit.Auditable;
import com.example.parking_management.model.space.enums.SpaceState;
import com.example.parking_management.model.space.enums.SpaceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ESPACIO")
public class Space extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ESPACIO")
    private Long idEspacio;

    @Column(name = "NUMERO_ESPACIO", nullable = false)
    private Integer numeroEspacio;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO", nullable = false)
    private SpaceState estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO_ESPACIO", nullable = false)
    private SpaceType tipoEspacio;

    @Column(name = "DIMENSIONES")
    private String dimensiones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PISO")
    private Level nivel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_ZONA")
    private Zone zona;
}
