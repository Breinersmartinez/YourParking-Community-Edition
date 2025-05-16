package com.example.parking_management.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "METODO_PAGO")
public class PaymentMethod {

    @Id
    @Column (name = "ID_METODO_PAGO")
    private int iDPaymentMethod;

    @Column (name = "METODO_PAGO")
    private String PaymentMethod;


    // Relacion de mapeo de objetos JPA de uno a uno
    @OneToOne (mappedBy = "paymentMethod", cascade = CascadeType.ALL)
    private Pay pay;
}
