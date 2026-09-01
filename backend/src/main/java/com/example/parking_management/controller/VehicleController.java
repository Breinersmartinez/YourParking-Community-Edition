package com.example.parking_management.controller;


import com.example.parking_management.dto.vehicleDTO.VehicleRequest;
import com.example.parking_management.dto.vehicleDTO.VehicleResponse;
import com.example.parking_management.model.vehicles.Vehicle;
import com.example.parking_management.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {


    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }


    //LISTAR LOS VEHICULOS
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        try {
            List<VehicleResponse> Vehilces = vehicleService.getAllVehicles();
            return ResponseEntity.ok(Vehilces);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // TRAER VEHICULO POR PLACA
    /*
     * Tanto los usuarios como los administradores pueden realizar peticiones
     * Los usuarios y administradores deben utilizar su respectivo tockend para poder realizar las peticiones
     * */
    @GetMapping("/{plate}")
    public Optional<Vehicle> getById(@PathVariable("plate") String plate) {
        return vehicleService.getVehicle(plate);
    }

    // TRAER VEHICULOS POR PROPIETARIO
    @GetMapping("/owner/{idCard}")
    public ResponseEntity<List<VehicleResponse>> getByOwner(@PathVariable("idCard") Integer idCard) {
        try {
            return ResponseEntity.ok(vehicleService.getVehiclesByOwner(idCard));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    //Crear vehiculo
//     Tanto los usuarios como los administradores pueden realizar peticiones
//     Los usuarios y administradores deben utilizar su respectivo tockend para poder realizar las peticiones

    @PostMapping
    public ResponseEntity<VehicleResponse> getAll(@RequestBody VehicleRequest request) {


        try {
            return ResponseEntity.ok(vehicleService.saveOrUpdate(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }


    }

    // Actualizar vehículo por placa
    @PutMapping("/{plate}")
    public ResponseEntity<VehicleResponse> update(@PathVariable("plate") String plate,
                                                  @RequestBody VehicleRequest request) {
        try {
            return ResponseEntity.ok(vehicleService.update(plate, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @DeleteMapping("/{plate}")
    public void saveOrUpdate(@PathVariable("plate") String plate) {
        vehicleService.delete(plate);
    }

}
