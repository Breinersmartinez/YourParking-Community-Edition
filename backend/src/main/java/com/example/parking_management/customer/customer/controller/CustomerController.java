package com.example.parking_management.customer.customer.controller;

import com.example.parking_management.customer.customer.dto.CustomerRequest;
import com.example.parking_management.customer.customer.dto.CustomerResponse;
import com.example.parking_management.customer.customer.service.CustomerService;
import com.example.parking_management.shared.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> create(@Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.createCustomer(request), "Cliente registrado"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.getCustomer(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CustomerResponse>>> search(
        @RequestParam(required = false) String fullName, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.searchCustomers(fullName, pageable)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CLIENTES_DELETE')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        customerService.deactivateCustomer(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Cliente desactivado"));
    }
}
