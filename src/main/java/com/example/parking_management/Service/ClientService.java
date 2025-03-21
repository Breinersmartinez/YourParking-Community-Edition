package com.example.parking_management.Service;
import com.example.parking_management.Entity.Client;
import com.example.parking_management.Repository.ClientRepository;
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


public Optional<Client> getClient(Long id)
{
    return clientRepository.findById(id);
}


public void saveOrUpdate(Client client)
{
    clientRepository.save(client);
}

public void delete( Long id)
{
    clientRepository.deleteById(id);
}
}
