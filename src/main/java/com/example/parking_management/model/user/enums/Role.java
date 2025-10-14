package com.example.parking_management.model.user.enums;

// Enum para roles
public enum Role {


    /*
     * Las autorizaciones con JWT se manejan segun el rol.
     * Por ejemplo:
     * Si es un administrador, se autoriza realizar operaciones con:
     * @PreAuthorize("hasRole('ADMIN')")
     *
     * Si el metodo no tiene la notacion @PreAuthorize("hasRole('ROL')")
     * Tanto los usuarios como los administradores pueden realizar peticiones
     *    Los usuarios y administradores deben utilizar su respectivo tockend para poder realizar las peticiones

     *  */


    ADMIN,
    OPERATOR,      // Operador de entrada/salida
    VIGILANTE,     // Solo monitoreo
    SUPERVISOR,    // Reportes y gestión
    USER           // Cliente final




}
