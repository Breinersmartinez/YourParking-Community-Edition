package com.example.parking_management.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import  com.example.parking_management.Service.ClientService;
import  com.example.parking_management.Entity.Client;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController

@RequestMapping(path = "api/v1/clients")
public class ClientController {

    @Autowired

    private ClientService clientService;

@GetMapping

public List<Client> getAll()
{
    return clientService.getClient();
}



    @GetMapping("/{clientId}")
    public Optional<Client> getBid(@PathVariable("clientId")Long clientId)
    {
    return clientService.getClient(clientId);

    }
    

    @PostMapping

    public void getAll(@RequestBody Client client)
    {
        clientService.saveOrUpdate(client);
    }

    @DeleteMapping("/{clientId}")
    public void saveOrUpdate(@PathVariable("clientId")Long clientId)
    {
        clientService.delete(clientId);
    }
  
}
