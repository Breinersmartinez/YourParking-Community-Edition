package com.example.parking_management.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "Espacio")

public class Space {

@Id
@Column (name = "ID_ESPACIO")
private Long spaceId;

@Column(name = "NUMERO_ESPACIO", unique = true, nullable = false)
private int numberSpace;

@Column (name = "ESTADO_ESPACIO")
private String stateSpace;

@Column (name = "TIPO_ESPACIO")
private String typeSpace;



}
