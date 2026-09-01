package com.example.parking_management.model.ticket;

import com.example.parking_management.audit.Auditable;
import com.example.parking_management.model.space.Space;
import com.example.parking_management.model.ticket.enums.TicketState;
import com.example.parking_management.model.vehicles.Vehicle;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "TICKET")
public class Ticket extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TICKET")
    private Long idTicket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLACA_VEHICULO")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_ESPACIO")
    private Space space;

    @Column(name = "FECHA_HORA_ENTRADA", nullable = false)
    private LocalDateTime entryDate;

    @Column(name = "FECHA_HORA_SALIDA")
    private LocalDateTime exitDate;

    @Column(name = "TIEMPO_TOTAL_MINUTOS")
    private Long totalMinutes;

    @Column(name = "VALOR_TOTAL", precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO", nullable = false)
    private TicketState state;

    public void close(LocalDateTime exitDate, BigDecimal totalAmount) {
        this.exitDate = exitDate;
        this.totalAmount = totalAmount;
        this.totalMinutes = Duration.between(this.entryDate, exitDate).toMinutes();
        this.state = TicketState.FINALIZADO;
    }
}
