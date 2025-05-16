package com.example.parking_management.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

//Reserva de espacios
@Getter
@Setter
@Entity
@Table (name = "RESERVA_ESPACIO")
public class Booking {

    @Id
    @Column (name = "ID_RESERVA_ESPACIO")
  private int iDBooking;

    @Column (name = "FECHA_INICIO")
  private String startDate;

    @Column (name = "FECHA_FIN")
  private String endDate;

    @Column (name = "ESTADO")
  private String state;


  // Llaves foraneas

    @ManyToOne
    @JoinColumn(name = "IDENTIFICACION" )
    private User user;

}
