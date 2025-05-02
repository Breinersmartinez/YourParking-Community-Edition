package com.example.parking_management.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import  com.example.parking_management.service.ClientService;
import  com.example.parking_management.model.Client;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController

@RequestMapping(path = "api/v1/clients")
public class ClientController {

    @Autowired

    private final ClientService clientService;
    public ClientController(ClientService clientService)
    {
        this.clientService = clientService;
    }

@GetMapping

public List<Client> getAll()
{
    return clientService.getClient();
}



    @GetMapping("/{clientIdCard}")
    public Optional<Client> getBid(@PathVariable("clientIdCard")Long idCard)
    {
    return clientService.getClient(idCard);

    }
    

    @PostMapping

    public void getAll(@RequestBody Client client)
    {
        clientService.saveOrUpdate(client);
    }

    @DeleteMapping("/{clientIdCard}")
    public void saveOrUpdate(@PathVariable("clientIdCard")Long idCard)
    {
        clientService.delete(idCard);
    }
  
}
