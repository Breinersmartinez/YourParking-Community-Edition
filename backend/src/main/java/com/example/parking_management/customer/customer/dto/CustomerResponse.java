package com.example.parking_management.customer.customer.dto;

import com.example.parking_management.customer.customer.model.DocumentType;
import java.time.LocalDateTime;

public record CustomerResponse(
    Long id,
    String fullName,
    String identityDocument,
    DocumentType documentType,
    String phone,
    String email,
    String address,
    Boolean active,
    LocalDateTime registrationDate
) {
}
