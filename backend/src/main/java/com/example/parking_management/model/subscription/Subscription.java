package com.example.parking_management.model.subscription;

import com.example.parking_management.audit.Auditable;
import com.example.parking_management.model.subscription.enums.SubscriptionState;
import com.example.parking_management.model.subscription.enums.SubscriptionType;
import com.example.parking_management.model.user.User;
import com.example.parking_management.model.vehicles.Vehicle;
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
@Table(name = "ABONO")
public class Subscription extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ABONO")
    private Long idAbono;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLACA_VEHICULO")
    private Vehicle vehicle;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO_ABONO", nullable = false)
    private SubscriptionType tipoAbono;

    @Column(name = "FECHA_INICIO", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "FECHA_FIN", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "MONTO", precision = 12, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO", nullable = false)
    private SubscriptionState estado;
}
