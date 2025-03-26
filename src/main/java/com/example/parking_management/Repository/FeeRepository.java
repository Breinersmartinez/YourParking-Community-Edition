package com.example.parking_management.Repository;

import com.example.parking_management.Entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface FeeRepository extends JpaRepository<Fee, Long>
{

}
