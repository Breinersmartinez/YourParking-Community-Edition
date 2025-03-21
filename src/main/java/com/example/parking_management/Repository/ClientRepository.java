package com.example.parking_management.Repository;
import com.example.parking_management.Entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    

    

}
