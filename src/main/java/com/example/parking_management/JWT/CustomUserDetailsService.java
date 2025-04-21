package com.example.parking_management.JWT;


import com.example.parking_management.Entity.Admin;
import com.example.parking_management.Repository.AdminRepository;
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

    public CustomUserDetailsService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            int idCard = Integer.parseInt(username);
            Optional<Admin> adminOptional = adminRepository.findById(idCard);

            if (adminOptional.isPresent()) {
                Admin admin = adminOptional.get();
                return new User(
                        String.valueOf(admin.getIdCard()),
                        admin.getPassword(),
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
                );
            } else {
                throw new UsernameNotFoundException("Usuario no encontrado con ID: " + idCard);
            }
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("ID de usuario no válido: " + username);
        }
    }
}
