package com.example.parking_management.repository;
import com.example.parking_management.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;


@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {

}
