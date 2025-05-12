package com.example.parking_management.service;
import com.example.parking_management.model.Client;
import com.example.parking_management.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class ClientService extends UserService{

    @Autowired

   ClientRepository clientRepository;

    public Optional<Client> getClient(int idCard)
    {
        return clientRepository.findById(idCard);
    }






}
