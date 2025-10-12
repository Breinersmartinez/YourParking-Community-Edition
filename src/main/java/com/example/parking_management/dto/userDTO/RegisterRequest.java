package com.example.parking_management.dto.userDTO;


import com.example.parking_management.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



// DTO para registro
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private Integer idCard;
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String direction;
    private User.Role role; // ADMIN o USER
}
