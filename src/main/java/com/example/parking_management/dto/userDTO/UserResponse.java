package com.example.parking_management.dto.userDTO;


import com.example.parking_management.model.User;
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
    private String name;
    private String email;
    private String phoneNumber;
    private String direction;
    private User.Role role;
    private LocalDateTime registrationDate;
    private Boolean active;
}