package com.example.parking_management.repository;

import com.example.parking_management.model.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface FeeRepository extends JpaRepository<Fee, Integer>
{

}
