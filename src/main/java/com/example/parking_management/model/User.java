package com.example.parking_management.model;

import com.example.parking_management.audit.Auditable;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;


@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table (name = "USUARIO")
public class User extends Auditable<User>  {

    @Id

// Atributos y tablas relacionadas en la bd
 @Column(name="IDENTIFICACION", unique = true, nullable = false)
 private int idCard;

 @Column(name="NOMBRE")
 private  String name;

 @Column(name="CONTRASEÑA")
 private String password;

    @Column(name = "CORREO")
    private String email;

    @Column(name = "NUMERO_TELEFONO")
    private String phoneNumber;

    @Column(name = "DIRECCION")
    private String direction;

    @Column(name = "FECHA_REGISTRO")
    private String registrationDate;


    // Relaciones de mapeo de objetos JPA de uno a uno

    @OneToMany (mappedBy = "user", cascade = CascadeType.ALL)
   private List<Vehicle> vehicles;

   @OneToMany (mappedBy = "user", cascade = CascadeType.ALL)
   private List<Ticket> tickets;

   @OneToMany (mappedBy = "user", cascade = CascadeType.ALL)
   private List<Booking> bookings;







 public int getIdCard() {
  return idCard;
 }

 public void setIdCard(int idCard) {
  this.idCard = idCard;
 }

 public String getName() {
  return name;
 }

 public void setName(String name) {
  this.name = name;
 }

 public String getPassword() {
  return password;
 }

 public void setPassword(String password) {
  this.password = password;
 }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(String registrationDate) {
        this.registrationDate = registrationDate;
    }

}
