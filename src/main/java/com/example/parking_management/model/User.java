package com.example.parking_management.model;

import com.example.parking_management.audit.Auditable;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
public class User   {

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
 private int phoneNumber;

 @Column(name = "DIRECCION")
 private String direction;

 @Column(name = "FECHA_REGISTRO")
 private Date registrationDate;

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

 public int getPhoneNumber() {
  return phoneNumber;
 }

 public void setPhoneNumber(int phoneNumber) {
  this.phoneNumber = phoneNumber;
 }

 public String getDirection() {
  return direction;
 }

 public void setDirection(String direction) {
  this.direction = direction;
 }

 public Date getRegistrationDate() {
  return registrationDate;
 }

 public void setRegistrationDate(Date registrationDate) {
  this.registrationDate = registrationDate;
 }
}
