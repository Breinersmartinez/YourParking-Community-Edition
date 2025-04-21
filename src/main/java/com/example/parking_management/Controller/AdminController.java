package com.example.parking_management.Controller;

import com.example.parking_management.Entity.Admin;

import com.example.parking_management.Repository.AdminRepository;
import com.example.parking_management.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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




    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Admin> getAll()
    {
        return adminService.getAdmin();
    }


    @PostMapping
    public void getAll(@RequestBody Admin admin)
    {
        adminService.save(admin);
    }


    @PutMapping("/{idCard}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable("idCard") int idCard, @RequestBody Admin admin) {
        admin.setIdCard(idCard); // Asegura que el ID esté bien asignado
        adminService.Update(admin);
        return ResponseEntity.ok("Administador actualizado");
    }



    @DeleteMapping("/{idCard}")
    @PreAuthorize("hasRole('ADMIN')")
    public void saveOrUpdate(@PathVariable("idCard")int idCard)
    {
        adminService.delete(idCard);
    }

    //Registro de nuevos administradores
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Admin admin) {
        adminService.save(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body("Administrador registrado correctamente");
    }


    //Login con proteccion JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin admin) {
        Map<String, Object> response = adminService.login(admin.getIdCard(), admin.getPassword());

        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }





}
