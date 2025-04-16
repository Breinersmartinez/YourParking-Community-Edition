package com.example.parking_management.Service;

import com.example.parking_management.Entity.Admin;
import com.example.parking_management.Repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired

    AdminRepository adminRepository;



    public Optional<Admin> getAdmin(int idCard)
    {
        return adminRepository.findById(idCard);
    }


    @Autowired
    private BCryptPasswordEncoder encoder;

    public void save(Admin admin) {
        admin.setPassword(encoder.encode(admin.getPassword()));
        adminRepository.save(admin);
    }



    public void Update(Admin admin) {
        Optional<Admin> existingUser = adminRepository.findById(admin.getIdCard());

        if (existingUser.isPresent()) {
            Admin adminFromDb = existingUser.get();

            // Actualizar el nombre de usuario si cambió
            adminFromDb.setNameAdmin(admin.getNameAdmin());

            // Verificar si la contraseña fue cambiada antes de volver a codificarla
            String nuevaContrasenia = admin.getPassword();
            if (!encoder.matches(nuevaContrasenia, adminFromDb.getPassword())) {
                adminFromDb.setPassword(encoder.encode(nuevaContrasenia));
            }

            adminRepository.save(adminFromDb);
        } else {
            // Si no existe, crear uno nuevo con la contraseña codificada
            admin.setPassword(encoder.encode(admin.getPassword()));
            adminRepository.save(admin);
        }
    }


    public void delete( int idCard)
    {
        adminRepository.deleteById(idCard);
    }



    //Login
    public boolean login(int idCard, String rawPassword) {
        Optional<Admin> optionalUser = adminRepository.findById(idCard);
        if (optionalUser.isPresent()) {
            String hashedPassword = optionalUser.get().getPassword();
            return encoder.matches(rawPassword, hashedPassword);
        }
        return false;
    }



}
