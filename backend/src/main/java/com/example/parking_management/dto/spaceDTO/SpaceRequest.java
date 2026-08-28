package com.example.parking_management.dto.spaceDTO;

import com.example.parking_management.model.space.enums.SpaceState;
import com.example.parking_management.model.space.enums.SpaceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpaceRequest {
    private Integer numeroEspacio;
    private SpaceState estado;
    private SpaceType tipoEspacio;
    private String dimensiones;
    private Long idPiso;
    private Long idZona;
}
