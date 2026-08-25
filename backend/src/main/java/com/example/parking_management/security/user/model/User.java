package com.example.parking_management.security.user.model;

import com.example.parking_management.security.role.model.Role;
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
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "usuarios")
public class User {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_usuario", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rol_id", nullable = false)
    private Role role;

    @Column(name = "activo", nullable = false)
    private Boolean active;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime creationDate;

    @Column(name = "ultimo_login")
    private LocalDateTime lastLogin;

    protected User() {
    }

    public void activate() {
        this.active = true;
    }

    public void deactivate() {
        this.active = false;
    }

    public void registerLogin() {
        this.lastLogin = LocalDateTime.now();
    }

    public boolean hasPermission(String permissionCode) {
        return role != null && role.hasPermission(permissionCode);
    }
}
