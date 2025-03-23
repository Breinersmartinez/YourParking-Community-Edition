package com.example.parking_management.Entity;

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

@GeneratedValue(strategy = GenerationType.IDENTITY)

private Long spaceId;
private String stateSpace;
private String typeSpace;

@Column(name = "Numero_espacio", unique = true, nullable = false)
private int numberSpace;

}
