package com.example.parking_management.customer.customer.dto;

import com.example.parking_management.customer.customer.model.DocumentType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustomerRequest(
    @NotBlank String fullName,
    @Size(max = 30) String identityDocument,
    DocumentType documentType,
    String phone,
    @Email String email,
    String address
) {
}
