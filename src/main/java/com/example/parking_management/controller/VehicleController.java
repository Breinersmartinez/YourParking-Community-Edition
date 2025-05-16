package com.example.parking_management.controller;


import com.example.parking_management.model.Vehicle;
import com.example.parking_management.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController

@RequestMapping(path = "api/vehicles")

public class VehicleController {

    @Autowired
    private final VehicleService vehicleService;
    public VehicleController(VehicleService vehicleService)
    {
        this.vehicleService = vehicleService;
    }


    @GetMapping
    public List<Vehicle> getAll()
    {
        return vehicleService.getVehicle();
    }


    @GetMapping("/{vehicleId}")
    public Optional<Vehicle> getById(@PathVariable("vehicleId") int vehicleId)
    {
        return vehicleService.getVehicle(vehicleId);
    }

    @PostMapping
    public void getAll(@RequestBody Vehicle vehicle )
    {
        vehicleService.saveOrUpdate(vehicle);
    }


    
    @DeleteMapping("/{vehicleId}")
    public void saveOrUpdate(@PathVariable("vehicleId") int vehicleId)
    {
        vehicleService.delete(vehicleId);
    }

}
