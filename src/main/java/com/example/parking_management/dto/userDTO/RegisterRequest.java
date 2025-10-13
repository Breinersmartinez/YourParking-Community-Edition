package com.example.parking_management.dto.userDTO;


import com.example.parking_management.model.User;

import com.example.parking_management.model.enums.IdentificationType;
import com.example.parking_management.model.enums.Role;
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
    //COMPOSICION
    private IdentificationType identificationType;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String direction;
    private Role role; // ADMIN o USER
}
