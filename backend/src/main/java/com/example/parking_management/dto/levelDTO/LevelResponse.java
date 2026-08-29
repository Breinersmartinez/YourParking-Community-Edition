package com.example.parking_management.dto.levelDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LevelResponse {
    private Long idPiso;
    private Integer numeroPiso;
    private Integer capacidadTotal;
    private Integer espaciosDisponibles;
}
