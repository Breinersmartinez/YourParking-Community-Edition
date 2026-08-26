package com.example.parking_management.customer.customer.repository;

import com.example.parking_management.customer.customer.model.Customer;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByIdentityDocument(String identityDocument);

    boolean existsByIdentityDocument(String identityDocument);

    Page<Customer> findByFullNameContainingIgnoreCase(String fullName, Pageable pageable);
}
