package com.example.parking_management.model;


import com.example.parking_management.audit.Auditable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
// Nombre de la tabla de la base de datos que esta mapeada la entidad
@Table(name = "ADMINISTRADOR")
@Data
public class Admin extends Auditable<String> {
    @Id

    // Atributos y tablas relacionadas en la bd
    @Column(name="IDENTIFICACION", unique = true, nullable = false)
    private int idCard;

    @Column(name="NOMBRE")
    private  String name;

    @Column(name="CONTRASEÑA")
    private String password;


    public int getIdCard() {
        return idCard;
    }

    public void setIdCard(int idCard) {
        this.idCard = idCard;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
