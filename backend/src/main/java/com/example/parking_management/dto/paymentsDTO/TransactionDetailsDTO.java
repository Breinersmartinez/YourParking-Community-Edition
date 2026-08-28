package com.example.parking_management.dto.paymentsDTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TransactionDetailsDTO {
    // monto neto recibido
    private Integer net_received_amount;

    // monto cobrado al pagador
    private Integer total_paid_amount;
}
