package com.example.parking_management.service;
import com.example.parking_management.model.Admin;
import com.example.parking_management.model.Client;
import com.example.parking_management.model.User;
import com.example.parking_management.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class ClientService extends UserService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    ClientRepository clientRepository;


    public Optional<Client> getClient(int idCard) {
        return clientRepository.findById(idCard);
    }

}