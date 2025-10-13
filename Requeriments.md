
## Entidades Principales

### 1. **USUARIO**
- id_usuario (PK)
- nombre
- apellido
- email
- teléfono
- tipo_documento
- numero_documento
- fecha_registro
- estado (activo/inactivo)

### 2. **VEHÍCULO**
- id_vehiculo (PK)
- id_usuario (FK)
- placa
- marca
- modelo
- color
- tipo_vehiculo (auto, moto, camioneta, etc.)
- año

### 3. **ESPACIO_PARQUEO**
- id_espacio (PK)
- numero_espacio
- id_piso (FK)
- id_zona (FK)
- tipo_espacio (estándar, discapacidad, familia, eléctrico)
- estado (disponible, ocupado, reservado, mantenimiento)
- dimensiones

### 4. **PISO/NIVEL**
- id_piso (PK)
- numero_piso
- capacidad_total
- espacios_disponibles

### 5. **ZONA/SECTOR**
- id_zona (PK)
- nombre_zona
- descripción
- id_piso (FK)

### 6. **REGISTRO_ENTRADA_SALIDA**
- id_registro (PK)
- id_vehiculo (FK)
- id_espacio (FK)
- fecha_hora_entrada
- fecha_hora_salida
- tiempo_total
- id_operador_entrada (FK)
- id_operador_salida (FK)

### 7. **TARIFA**
- id_tarifa (PK)
- tipo_vehiculo
- precio_hora
- precio_fraccion
- precio_dia
- precio_mes
- fecha_vigencia_inicio
- fecha_vigencia_fin

### 8. **PAGO**
- id_pago (PK)
- id_registro (FK)
- monto_total
- metodo_pago (efectivo, tarjeta, app, QR)
- fecha_hora_pago
- estado_pago (pendiente, pagado, cancelado)
- referencia_transaccion

### 9. **RESERVA**
- id_reserva (PK)
- id_usuario (FK)
- id_espacio (FK)
- fecha_hora_inicio
- fecha_hora_fin
- estado (pendiente, confirmada, cancelada, cumplida)
- monto_reserva

### 10. **OPERADOR/EMPLEADO**
- id_operador (PK)
- nombre
- apellido
- usuario
- contraseña (hash)
- rol (administrador, operador, vigilancia)
- turno
- estado

### 11. **ABONO/MENSUALIDAD**
- id_abono (PK)
- id_usuario (FK)
- id_vehiculo (FK)
- tipo_abono (mensual, trimestral, anual)
- fecha_inicio
- fecha_fin
- monto
- estado (activo, vencido, cancelado)

### 12. **INCIDENTE**
- id_incidente (PK)
- id_espacio (FK)
- id_vehiculo (FK)
- fecha_hora
- tipo_incidente (daño, robo, accidente, otro)
- descripción
- estado (reportado, en_proceso, resuelto)

## Relaciones Principales

- **USUARIO** → **VEHÍCULO** (1:N) - Un usuario puede tener varios vehículos
- **VEHÍCULO** → **REGISTRO_ENTRADA_SALIDA** (1:N) - Un vehículo tiene múltiples registros
- **ESPACIO_PARQUEO** → **REGISTRO_ENTRADA_SALIDA** (1:N) - Un espacio tiene múltiples registros de uso
- **PISO** → **ESPACIO_PARQUEO** (1:N) - Un piso contiene varios espacios
- **ZONA** → **ESPACIO_PARQUEO** (1:N) - Una zona agrupa varios espacios
- **REGISTRO_ENTRADA_SALIDA** → **PAGO** (1:1) - Cada registro genera un pago
- **TARIFA** → **PAGO** (1:N) - Una tarifa se aplica a múltiples pagos
- **USUARIO** → **RESERVA** (1:N) - Un usuario puede hacer varias reservas
- **ESPACIO_PARQUEO** → **RESERVA** (1:N) - Un espacio puede ser reservado múltiples veces
- **USUARIO** → **ABONO** (1:N) - Un usuario puede tener varios abonos
- **OPERADOR** → **REGISTRO_ENTRADA_SALIDA** (1:N) - Un operador registra múltiples entradas/salidas

