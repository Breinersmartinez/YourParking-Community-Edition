package com.example.parking_management.dto.userDTO;


import com.example.parking_management.model.User;
import com.example.parking_management.model.enums.IdentificationType;
import com.example.parking_management.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;
// DTO para respuesta de usuario (sin contraseña)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer idCard;
    //COMPOSICION
    private IdentificationType identificationType;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String direction;
    private Role role;
    private LocalDateTime registrationDate;
    private Boolean active;
}