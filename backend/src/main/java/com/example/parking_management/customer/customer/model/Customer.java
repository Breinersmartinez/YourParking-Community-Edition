package com.example.parking_management.customer.customer.model;

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
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "clientes")
public class Customer {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "documento_identidad", length = 30)
    private String identityDocument;

    @Column(name = "tipo_documento", length = 20)
    private DocumentType documentType;

    @Column(name = "nombre_completo", nullable = false, length = 150)
    private String fullName;

    @Column(name = "telefono", length = 20)
    private String phone;

    @Column(name = "correo_electronico", length = 150)
    private String email;

    @Column(name = "direccion", length = 200)
    private String address;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime registrationDate;

    @Column(name = "activo", nullable = false)
    private Boolean active;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creado_por", nullable = false)
    private User createdBy;

    protected Customer() {
    }

    public void activate() {
        this.active = true;
    }

    public void deactivate() {
        this.active = false;
    }

    public boolean hasNotificationChannel() {
        return (phone != null && !phone.isBlank()) || (email != null && !email.isBlank());
    }
}
