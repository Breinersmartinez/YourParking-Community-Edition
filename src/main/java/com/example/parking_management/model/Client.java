package com.example.parking_management.model;

import com.example.parking_management.audit.Auditable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
@Data 
@Entity

@Table (name = "Clientes")

public class Client extends Auditable<String>
{
    @Id
    // Atributos y tablas relacionadas en la bd
    @Column(name="IDENTIFICACION", unique = true, nullable = false)
    private int idCard;

    @Column(name="NOMBRE")
    private  String name;

    @Column(name="CONTRASEÑA")
    private String password;

    @Column(name = "")
    private String role;

@Column(name="email_adress", unique = true, nullable = false)
private String email;

}



