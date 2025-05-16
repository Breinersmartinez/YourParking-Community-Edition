
###  ENTIDADES Y ATRIBUTOS (con relaciones)

---

####  `USUARIO` (User)

Hereda en `ADMINISTRADOR` y `CLIENTE`

* `identificacion` (PK)
* `nombre`
* `contraseña`
* `correo`
* `numero_telefono`
* `direccion`
* `fecha_registro`

Relaciones:

* 1\:N con `VEHICULO` (un usuario puede tener varios vehículos)
* 1\:N con `TICKET` (si decides asociar directamente)
* 1\:N con `BOOKING` (si reservas espacios)

---

####  `ADMINISTRADOR` (Admin)

Hereda de `USUARIO`

* Mismos atributos, no requiere nuevos

---

####  `CLIENTE` (Client)

Hereda de `USUARIO`

* Igual que Admin

---

####  `VEHICULO` (Vehicle)

* `id_vehiculo` (PK)
* `identificacion` (FK a USUARIO)
* `placa_vehiculo` (única)
* `tipo_vehiculo`
* `marca_vehiculo`
* `color_vehiculo`
* `tarjeta_propiedad`
* `hora_entrada`
* `hora_salida`

Relaciones:

* N:1 con `USUARIO`
* 1:1 con `TICKET` (opcional)
* N:1 con `ESPACIO` (si asocias directamente)
* N:1 con `TARIFA` (según tipo de vehículo)

---

####  `ESPACIO` (Space)

* `space_id` (PK)
* `numero_espacio` (único)
* `estado_espacio` (libre/ocupado)
* `tipo_espacio` (moto, carro...)

Relaciones:

* 1\:N con `BOOKING` o `TICKET` si reservas espacio específico

---

####  `TARIFA` (Fee)

* `id_tarifa` (PK)
* `tipo_vehiculo` (único)
* `valor_hora`
* `valor_dia`

Relaciones:

* 1\:N con `VEHICULO` (opcional si se quiere saber cuánto pagar por tipo)

---

####  `BOOKING` (Reserva de espacio)

**(Diseñala así)**

* `id_booking` (PK)
* `id_usuario` (FK)
* `id_espacio` (FK)
* `fecha_inicio`
* `fecha_fin`
* `estado` (activa, cancelada)

---

####  `TICKET`

* `id_ticket` (PK)
* `id_vehiculo` (FK)
* `id_usuario` (FK)
* `id_espacio` (FK, opcional)
* `fecha_entrada`
* `fecha_salida`
* `valor_total`

---

####  `PAGO` (Pay)

**(Podrías agregar algo así)**

* `id_pago` (PK)
* `id_ticket` (FK)
* `fecha_pago`
* `monto`
* `metodo_pago` (efectivo, tarjeta...)

---

###  MRD (Modelo Relacional de Datos)

Te lo muestro en texto (puedo generar un diagrama si lo necesitas también):

```plaintext
USUARIO (identificacion PK, nombre, contraseña, correo, telefono, direccion, fecha_registro)
    ↑
    ├── CLIENTE (identificacion PK, FK)
    └── ADMINISTRADOR (identificacion PK, FK)

VEHICULO (id_vehiculo PK, placa UNIQUE, tipo, marca, color, tarjeta_propiedad, hora_entrada, hora_salida, identificacion FK)

ESPACIO (space_id PK, numero_espacio UNIQUE, estado_espacio, tipo_espacio)

TARIFA (id_tarifa PK, tipo_vehiculo UNIQUE, valor_hora, valor_dia)

TICKET (id_ticket PK, id_vehiculo FK, id_usuario FK, id_espacio FK, fecha_entrada, fecha_salida, valor_total)

BOOKING (id_booking PK, id_usuario FK, id_espacio FK, fecha_inicio, fecha_fin, estado)

PAGO (id_pago PK, id_ticket FK, fecha_pago, monto, metodo_pago)
```

---
### Spring Data JPA - Mapeo de relaciones entre entidades - uno a muchos y muchos a uno

``` bash
https://www.tutorialesprogramacionya.com/springbootya/detalleconcepto.php?punto=14&codigo=15&inicio=0
```

