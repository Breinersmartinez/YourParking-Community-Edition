package com.example.parking_management.Entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
// Nombre de la tabla de la base de datos que esta mapeada la entidad
@Table(name = "Administrador")
@Data
public class Admin {
    @Id

    // Atributos y tablas relacionadas en la bd

    @Column(name="IdentificacionAdministrador", unique = true, nullable = false)
    private int idCard;
    private  String nameAdmin;
    private String password;


    public int getIdCard() {
        return idCard;
    }

    public void setIdCard(int idCard) {
        this.idCard = idCard;
    }

    public String getNameAdmin() {
        return nameAdmin;
    }

    public void setNameAdmin(String nameAdmin) {
        this.nameAdmin = nameAdmin;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
