package com.example.parking_management.dto.userDTO;



import com.example.parking_management.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO para actualizar usuario
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private Integer idCard;
    private User.IdentificationType identificationType;
    private String firstName;
    private String lastName;
    private String email;
    private String password; // Opcional, solo si se quiere cambiar
    private String phoneNumber;
    private String direction;
    private User.Role role;
    private Boolean active;
}