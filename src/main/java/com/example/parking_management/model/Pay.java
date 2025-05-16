package com.example.parking_management.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "PAGO")
public class Pay {

    @Id
    @Column (name = "ID_PAGO")
    private int iDPay;

    @Column (name = "ID_TICKET")
    private int iDTicket;

    @Column (name = "FECHA_PAGO")
    private String paymentDate;

    @Column (name = "MONTO")
    private Double amount;

    //  Llave foranea
    @OneToOne
    @JoinColumn(name = "ID_METODO_PAGO")
   private PaymentMethod paymentMethod;
}
