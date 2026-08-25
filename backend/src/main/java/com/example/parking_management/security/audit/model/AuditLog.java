package com.example.parking_management.security.audit.model;

import com.example.parking_management.security.user.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * Entidad inmutable (append-only, RN-010): solo se crea vía el método de fábrica,
 * no existen setters ni formas de modificar un registro posterior a su creación.
 */
@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "auditoria")
public class AuditLog {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User user;

    @Column(name = "accion", nullable = false, length = 100)
    private String action;

    @Column(name = "entidad", nullable = false, length = 100)
    private String entity;

    @Column(name = "entidad_id", nullable = false)
    private Long entityId;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "resultado", nullable = false, length = 20)
    private String result;

    @Column(name = "detalle", columnDefinition = "text")
    private String detail;

    private AuditLog(User user, String action, String entity, Long entityId,
                     LocalDateTime dateTime, String result, String detail) {
        this.user = user;
        this.action = action;
        this.entity = entity;
        this.entityId = entityId;
        this.dateTime = dateTime;
        this.result = result;
        this.detail = detail;
    }

    protected AuditLog() {
    }

    public static AuditLog register(User user, String action, String entity, Long entityId,
                                    String result, String detail) {
        return new AuditLog(user, action, entity, entityId, LocalDateTime.now(), result, detail);
    }
}
