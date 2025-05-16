package com.example.parking_management.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Ticket {

    @Id
    @Column (name = "")
    private String entryTime;
    @Column(name = "")
    private String departureTime;
    @Column (name = "")
    private Double totalValue;


    //--------- Llaves foraneas ---------
}
