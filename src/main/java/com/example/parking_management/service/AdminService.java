package com.example.parking_management.service;


import com.example.parking_management.model.Admin;
import com.example.parking_management.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AdminService extends UserService{
    @Autowired

    AdminRepository adminRepository;


    public List<Admin> getAdmin()
    {
        return adminRepository.findAll();
    }


}
