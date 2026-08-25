package com.example.parking_management.customer.customer.service;

import com.example.parking_management.customer.customer.dto.CustomerRequest;
import com.example.parking_management.customer.customer.dto.CustomerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {

    CustomerResponse createCustomer(CustomerRequest request);

    CustomerResponse getCustomer(Long id);

    Page<CustomerResponse> searchCustomers(String fullName, Pageable pageable);

    void deactivateCustomer(Long id);
}
