package com.example.parking_management.model.rate;

import com.example.parking_management.audit.Auditable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "TARIFA")
public class Rate extends Auditable<Rate> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TARIFA")
    private Long idTarifa;

    @Column(name = "TIPO_VEHICULO", nullable = false)
    private String tipoVehiculo;

    @Column(name = "PRECIO_HORA", precision = 12, scale = 2)
    private BigDecimal precioHora;

    @Column(name = "PRECIO_FRACCION", precision = 12, scale = 2)
    private BigDecimal precioFraccion;

    @Column(name = "PRECIO_DIA", precision = 12, scale = 2)
    private BigDecimal precioDia;

    @Column(name = "PRECIO_MES", precision = 12, scale = 2)
    private BigDecimal precioMes;

    @Column(name = "PRECIO_ANIO", precision = 12, scale = 2)
    private BigDecimal precioAnio;

    @Column(name = "FECHA_VIGENCIA_INICIO")
    private LocalDate fechaVigenciaInicio;

    @Column(name = "FECHA_VIGENCIA_FIN")
    private LocalDate fechaVigenciaFin;
}
