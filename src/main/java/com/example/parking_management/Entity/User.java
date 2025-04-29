package com.example.parking_management.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Data
public class User {

  private int idCard;

  private  String name;

  private String password;

 private String email;

 private int phoneNumber;

 private String direction;

 private Date registrationDate;

}
