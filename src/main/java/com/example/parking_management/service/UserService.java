package com.example.parking_management.service;

import com.example.parking_management.JWT.JwtService;
import com.example.parking_management.model.Admin;
import com.example.parking_management.model.Client;
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


    // Login para ADMIN por CÉDULA
    public Map<String, Object> loginByIdCard(int idCard, String rawPassword) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findById(idCard);
        if (userOpt.isPresent() && userOpt.get() instanceof Admin) {
            User user = userOpt.get();
            if (encoder.matches(rawPassword, user.getPassword())) {
                String role = "ROLE_ADMIN";

                UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                        .username(String.valueOf(user.getIdCard()))
                        .password(user.getPassword())
                        .authorities(role)
                        .build();

                String token = jwtService.generateToken(userDetails);

                response.put("success", true);
                response.put("token", token);
                response.put("user", user);
                response.put("role", role);
                return response;
            }
        }

        response.put("success", false);
        response.put("message", "Credenciales inválidas");
        return response;
    }



    // Login para CLIENTE por CORREO
    public Map<String, Object> loginByEmail(String email, String rawPassword) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get() instanceof Client) {
            User user = userOpt.get();
            if (encoder.matches(rawPassword, user.getPassword())) {
                String role = "ROLE_CLIENT";

                UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .authorities(role)
                        .build();

                String token = jwtService.generateToken(userDetails);

                response.put("success", true);
                response.put("token", token);
                response.put("user", user);
                response.put("role", role);
                return response;
            }
        }

        response.put("success", false);
        response.put("message", "Credenciales inválidas");
        return response;
    }

}

