package com.example.parking_management.dto;



import com.example.parking_management.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

// DTO para actualizar usuario
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String name;
    private String email;
    private String password; // Opcional, solo si se quiere cambiar
    private String phoneNumber;
    private String direction;
    private User.Role role;
    private Boolean active;
}