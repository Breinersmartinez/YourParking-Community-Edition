package com.example.parking_management.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;


@Entity
// Nombre de la tabla de la base de datos que esta mapeada la entidad
@Table(name = "ADMINISTRADOR")
public class Admin extends User {

}
