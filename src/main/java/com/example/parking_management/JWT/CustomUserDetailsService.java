package com.example.parking_management.JWT;


import com.example.parking_management.model.Admin;
import com.example.parking_management.model.Client;
import com.example.parking_management.repository.AdminRepository;
import com.example.parking_management.repository.ClientRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final ClientRepository clientRepository;


    public CustomUserDetailsService(AdminRepository adminRepository, ClientRepository clientRepository) {
        this.adminRepository = adminRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            int idCard = Integer.parseInt(username);

            //Buscar como administrador
            Optional<Admin> adminOptional = adminRepository.findById(idCard);

            if (adminOptional.isPresent()) {
                Admin admin = adminOptional.get();
                return new User(
                        String.valueOf(admin.getIdCard()),
                        admin.getPassword(),
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
                );
            }

                // Buscar como cliente
                Optional<Client> clientOptional = clientRepository.findById(idCard);
                if (clientOptional.isPresent()) {
                    Client client = clientOptional.get();
                    return new User(
                            String.valueOf(client.getIdCard()),
                            client.getPassword(),
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                }

                //Si no encuentra ningun susario
                throw new UsernameNotFoundException("Usuario no encontrado con ID: " + idCard);

        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("ID de usuario no válido: " + username);
        }
    }
}
