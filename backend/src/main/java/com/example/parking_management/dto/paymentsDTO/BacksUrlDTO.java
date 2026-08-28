package com.example.parking_management.dto.paymentsDTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter

public class BacksUrlDTO {

    private String success;

    private String failure;

    private String pending;
}
