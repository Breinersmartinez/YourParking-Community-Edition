package com.example.parking_management.Service;

import com.example.parking_management.Entity.Admin;
import com.example.parking_management.Entity.Fee;
import com.example.parking_management.JWT.JwtService;
import com.example.parking_management.Repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired

    AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;






    public List<Admin> getAdmin()
    {
        return adminRepository.findAll();
    }


    public Optional<Admin> getAdmin(int idCard)
    {
        return adminRepository.findById(idCard);
    }




    public void save(Admin admin) {
        admin.setPassword(encoder.encode(admin.getPassword()));
        adminRepository.save(admin);
    }



    public void Update(Admin admin) {
        Optional<Admin> existingUser = adminRepository.findById(admin.getIdCard());

        if (existingUser.isPresent()) {
            Admin adminFromDb = existingUser.get();

            // Actualizar el nombre de usuario
            adminFromDb.setNameAdmin(admin.getNameAdmin());

            // Solo actualiza la contraseña si viene una nueva (no nula o vacía)
            String nuevaContrasenia = admin.getPassword();
            if (nuevaContrasenia != null && !nuevaContrasenia.trim().isEmpty()) {
                // Si la nueva contraseña es distinta (no está ya codificada igual), la actualiza
                if (!encoder.matches(nuevaContrasenia, adminFromDb.getPassword())) {
                    adminFromDb.setPassword(encoder.encode(nuevaContrasenia));
                }
            }

            adminRepository.save(adminFromDb);
        } else {
            // Si no existe, lo crea con la contraseña codificada
            admin.setPassword(encoder.encode(admin.getPassword()));
            adminRepository.save(admin);
        }
    }



    public void delete( int idCard)
    {
        adminRepository.deleteById(idCard);
    }



    // Método modificado para devolver token JWT
    public Map<String, Object> login(int idCard, String rawPassword) {
        Map<String, Object> response = new HashMap<>();

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            String.valueOf(idCard),
                            rawPassword
                    )
            );

            if (authentication.isAuthenticated()) {
                Optional<Admin> admin = adminRepository.findById(idCard);
                if (admin.isPresent()) {
                    UserDetails userDetails = User.builder()
                            .username(String.valueOf(idCard))
                            .password(admin.get().getPassword())
                            .authorities("ROLE_ADMIN")
                            .build();

                    String token = jwtService.generateToken(userDetails);

                    response.put("success", true);
                    response.put("token", token);
                    response.put("admin", admin.get());
                    return response;
                }
            }
        } catch (Exception e) {
            // Autenticación fallida
        }

        response.put("success", false);
        response.put("message", "Credenciales inválidas");
        return response;
    }



}
