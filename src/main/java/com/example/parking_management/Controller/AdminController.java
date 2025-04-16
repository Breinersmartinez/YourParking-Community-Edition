package com.example.parking_management.Controller;

import com.example.parking_management.Entity.Admin;
import com.example.parking_management.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000",
        "https://Breynersmartinez.github.io"
})

@RestController
@RequestMapping("/Administrador")
public class AdminController {
    @Autowired
    private AdminService adminService;



    @GetMapping("/{idCard}")
    public Optional<Admin> getById(@PathVariable("idCard") int idCard) {
        return adminService.getAdmin(idCard);
    }


    @PostMapping
    public void getAll(@RequestBody Admin admin)
    {
        adminService.save(admin);
    }


    @PutMapping("/{idCard}")
    public ResponseEntity<?> updateUser(@PathVariable("idCard") int idCard, @RequestBody Admin admin) {
        admin.setIdCard(idCard); // Asegura que el ID esté bien asignado
        adminService.Update(admin);
        return ResponseEntity.ok("Administador actualizado");
    }



    @DeleteMapping("/{idCard}")
    public void saveOrUpdate(@PathVariable("idCard")int idCard)
    {
        adminService.delete(idCard);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin admin) {
        boolean valid = adminService.login(admin.getIdCard(), admin.getPassword());
        if (valid) {
            return ResponseEntity.ok("Login correcto");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login incorrecto");
        }
    }




}
