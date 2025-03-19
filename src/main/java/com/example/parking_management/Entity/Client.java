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

@Table (name = "Clientes")

public class Client {
    @id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long IdClient;
    private String firstName;
    private String lastName;
    private String password;

@Column(name="email_adress", unique = true, nullable = false)
private string email;

}

