package com.example.parking_management.service;
import com.example.parking_management.model.Client;
import com.example.parking_management.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired

ClientRepository clientRepository;


public List<Client> getClient()
{
    return clientRepository.findAll();
}


public Optional<Client> getClient(Long idCard)
{
    return clientRepository.findById(idCard);
}


public void saveOrUpdate(Client client)
{
    clientRepository.save(client);
}

public void delete( Long idCard)
{
    clientRepository.deleteById(idCard);
}
}
