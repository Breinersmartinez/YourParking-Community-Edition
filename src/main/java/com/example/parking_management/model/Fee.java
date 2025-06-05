package com.example.parking_management.model;


import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name="Tarifas")
public class Fee {
    @Id
    @Column(name = "ID_TARIFA")
    private int feeId;

    @Column (name = "VALOR_HORA")
    private int hourValue;

    @Column (name = "VALOR_DIA")
    private int dayValue;

    @Column (name = "VALOR_MES")
    private int monthlyValue;



    //------------------- Llaves Foraneas --------------

}
