package com.example.parking_management.service;


import com.example.parking_management.model.Admin;
import com.example.parking_management.model.Client;
import com.example.parking_management.repository.AdminRepository;
import com.example.parking_management.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class AdminService extends UserService{
    @Autowired

    AdminRepository adminRepository;

    @Autowired
    ClientRepository clientRepository;

    public List<Client> getClient() {
        return clientRepository.findAll();
    }

    public List<Admin> getAdmin()
    {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdmin(int idCard)
    {
        return adminRepository.findById(idCard);
    }

}
