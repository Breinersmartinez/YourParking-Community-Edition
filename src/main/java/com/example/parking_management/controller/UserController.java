package com.example.parking_management.controller;


import com.example.parking_management.model.User;
import com.example.parking_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000",
        "https://Breynersmartinez.github.io"
})

@RestController
@RequestMapping("/Usuarios")
public class UserController {
    @Autowired
    private final UserService userService;
    public UserController( UserService userService)
    {
        this.userService = userService;
    }




    @GetMapping
    public List<User> getAll()
    {
        return userService.getUser();
    }


    @PostMapping
    public void getAll(@RequestBody User user)
    {
        userService.save(user);
    }


    @PutMapping("/{idCard}")
    public ResponseEntity<?> updateUser(@PathVariable("idCard") int idCard, @RequestBody User user) {
        user.setIdCard(idCard); // Asegura que el ID esté bien asignado
        userService.update(user);
        return ResponseEntity.ok("Usuario actualizado");
    }



    @DeleteMapping("/{idCard}")
    public void saveOrUpdate(@PathVariable("idCard")int idCard)
    {
        userService.delete(idCard);
    }

    //Registro de nuevos administradores
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado correctamente");
    }


    //Login con proteccion JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Map<String, Object> response = userService.login(user.getIdCard(), user.getPassword());

        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }





}
