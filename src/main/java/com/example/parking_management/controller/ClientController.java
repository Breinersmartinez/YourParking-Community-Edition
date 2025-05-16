package com.example.parking_management.controller;


import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import  com.example.parking_management.service.ClientService;
import  com.example.parking_management.model.Client;


@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000",
        "https://Breynersmartinez.github.io"
})

@RestController
@RequestMapping("/Cliente")
public class ClientController {

    private final ClientService clientService;
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }


    @GetMapping("/{idCard}")
    public Optional<Client> getById(@PathVariable("idCard") int idCard) {
        return clientService.getClient(idCard);

    }



    @PostMapping
    public void getAll(@RequestBody Client client) {
        clientService.save(client);
    }


    @PutMapping("/{idCard}")
    public ResponseEntity<?> updateUser(@PathVariable("idCard") int idCard, @RequestBody Client client) {
        client.setIdCard(idCard); // Asegura que el ID esté bien asignado
        clientService.update(client);
        return ResponseEntity.ok("Cliente actualizado");
    }


    @DeleteMapping("/{idCard}")
    public void saveOrUpdate(@PathVariable("idCard") int idCard) {
        clientService.delete(idCard);
    }

    //Registro de nuevos administradores
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Client client) {
        clientService.save(client);
        return ResponseEntity.status(HttpStatus.CREATED).body("Cliente registrado correctamente");
    }


    //Login con proteccion JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Client client) {
        Map<String, Object> response = clientService.loginByEmail(client.getEmail(), client.getPassword());

        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

}