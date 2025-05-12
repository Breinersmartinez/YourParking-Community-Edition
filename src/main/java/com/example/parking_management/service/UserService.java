package com.example.parking_management.service;

import com.example.parking_management.JWT.JwtService;
import com.example.parking_management.model.Admin;
import com.example.parking_management.model.User;
import com.example.parking_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;



    public List<User> getUser()
    {
        return userRepository.findAll();
    }


    public Optional<User> getUser(int  idCard)
    {
        return userRepository.findById(idCard);
    }


    public void save(User user)
    {
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
    }


    public void update(User user)
    {
        Optional<User> existinUser = userRepository.findById(user.getIdCard());

        if(existinUser.isPresent()) {
            User userFromDb = existinUser.get();


            //Actualizacion de nombre de usuario
            userFromDb.setName(user.getName());

            //Solo actualiza la contraseña si viene una nueva (no vacia o nula)
            String nuevaContrasenia = user.getPassword();
            if (nuevaContrasenia != null && !nuevaContrasenia.trim().isEmpty())
            {
                // si la nueva contraseña es distinta (no esta ya codificada igual), la actualiza
                if (!encoder.matches(nuevaContrasenia, userFromDb.getPassword()))
                {
                    userFromDb.setPassword(encoder.encode(nuevaContrasenia));
                }
            }
            userRepository.save(userFromDb);
            }
            else
            {
                // si no existe, lo crea con la nueva contraseña codificada
                user.setPassword(encoder.encode(user.getPassword()));
                userRepository.save(user);
            }

        }

        public void delete(int idCard)
        {
            userRepository.deleteById(idCard);
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
                Optional<User> user = userRepository.findById(idCard);
                if (user.isPresent()) {
                    String role = "ROLE_USER"; // Cambiado de "ROL_USER" a "ROLE_USER"
                    if(user.get() instanceof Admin) {
                        role = "ROLE_ADMIN";
                    }

                    UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                            .username(String.valueOf(idCard))
                            .password(user.get().getPassword())
                            .authorities(role)
                            .build();

                    String token = jwtService.generateToken(userDetails);

                    response.put("success", true);
                    response.put("token", token);
                    response.put("user", user.get());
                    response.put("role", role); // Añadir el rol para depuración
                    return response;
                }
            }
        } catch (Exception e) {
            // Agregamos logs para facilitar la depuración
            System.err.println("Error en autenticación: " + e.getMessage());
            e.printStackTrace();
        }

        response.put("success", false);
        response.put("message", "Credenciales inválidas");
        return response;
    }

}

