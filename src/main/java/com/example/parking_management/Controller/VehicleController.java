package com.example.parking_management.Controller;


import com.example.parking_management.Entity.Vehicle;
import com.example.parking_management.Service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController

@RequestMapping(path = "api/vehicles")

public class VehicleController {

    @Autowired

    private VehicleService vehicleService;


    @GetMapping
    public List<Vehicle> getAll()
    {
        return vehicleService.getVehicle();
    }


    @GetMapping("/{vehicleId}")
    public Optional<Vehicle> getById(@PathVariable("vehicleId") Long vehicleId)
    {
        return vehicleService.getVehicle(vehicleId);
    }

    @PostMapping
    public void getAll(@RequestBody Vehicle vehicle )
    {
        vehicleService.saveOrUpdate(vehicle);
    }


    
    @DeleteMapping("/{vehicleId}")
    public void saveOrUpdate(@PathVariable("vehicleId") Long vehicleId)
    {
        vehicleService.delete(vehicleId);
    }

}
