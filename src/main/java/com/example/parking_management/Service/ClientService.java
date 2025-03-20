package com.example.parking_management.Service;
import com.example.parking_management.Entity;
import com.example.parking_management.Repository;

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
