package com.example.parking_management.model.incident;

import com.example.parking_management.audit.Auditable;
import com.example.parking_management.model.incident.enums.IncidentState;
import com.example.parking_management.model.incident.enums.IncidentType;
import com.example.parking_management.model.space.Space;
import com.example.parking_management.model.vehicles.Vehicle;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "INCIDENTE")
public class Incident extends Auditable<Incident> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_INCIDENTE")
    private Long idIncidente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_ESPACIO")
    private Space space;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLACA_VEHICULO")
    private Vehicle vehicle;

    @Column(name = "FECHA_HORA", nullable = false)
    private LocalDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO_INCIDENTE", nullable = false)
    private IncidentType tipoIncidente;

    @Column(name = "DESCRIPCION", length = 1000)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO", nullable = false)
    private IncidentState estado;
}
