package com.example.parking_management.Service;

import com.example.parking_management.Entity.Vehicle;
import com.example.parking_management.Repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

  @Autowired
    VehicleRepository vehicleRepository;

  public List<Vehicle> getVehicle()
  {
      return vehicleRepository.findAll();
  }


  public Optional<Vehicle> getVehicle(Long Id)
  {
      return vehicleRepository.findById(Id);
  }

  public void saveOrUpdate(Vehicle vehicle)
  {
      vehicleRepository.save(vehicle);
  }

  public void delete(Long id)
  {
      vehicleRepository.deleteById(id);
  }
}
