package com.example.parking_management.customer.customer.service.impl;

import com.example.parking_management.customer.customer.dto.CustomerRequest;
import com.example.parking_management.customer.customer.dto.CustomerResponse;
import com.example.parking_management.customer.customer.repository.CustomerRepository;
import com.example.parking_management.customer.customer.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public CustomerResponse createCustomer(CustomerRequest request) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomer(Long id) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> searchCustomers(String fullName, Pageable pageable) {
        throw new UnsupportedOperationException("Sin implementar");
    }

    @Override
    public void deactivateCustomer(Long id) {
        throw new UnsupportedOperationException("Sin implementar");
    }
}
