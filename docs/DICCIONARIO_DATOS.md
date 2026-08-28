# 🗄️ Diccionario de Datos — YourParking

Diccionario de datos de la base de datos del sistema de gestión de parqueaderos **YourParking**.

- Motor: **PostgreSQL 17**
- Replica el modelo definido por las entidades JPA del backend (`com.example.parking_management.model`).
- Esquema de referencia: [`db/parking_management.sql`](../db/parking_management.sql).
- Convención de nombres: `PhysicalNamingStrategyStandardImpl` → los nombres de tablas y columnas se usan **tal cual** se declaran en `@Table` / `@Column` (en mayúsculas).

---

## Resumen de tablas

| Tabla | Entidad | Descripción |
| ----- | ------- | ----------- |
| `USUARIO` | `User` | Usuarios del sistema (clientes y personal). |
| `PISO` | `Level` | Niveles/pisos del parqueadero. |
| `ZONA` | `Zone` | Zonas o sectores dentro de un piso. |
| `ESPACIO` | `Space` | Espacios de parqueo. |
| `VEHICULO` | `Vehicle` | Vehículos registrados. |
| `TICKET` | `Ticket` | Registro de entrada/salida de vehículos. |
| `RESERVA` | `Reservation` | Reservas de espacios. |
| `TARIFA` | `Rate` | Tarifas de parqueo por tipo de vehículo. |
| `PAGO` | `Payment` | Pagos asociados a tickets. |
| `ABONO` | `Subscription` | Abonos / mensualidades de usuarios. |
| `INCIDENTE` | `Incident` | Incidentes reportados. |

---

## Campos comunes de auditoría

Todas las tablas heredan de la clase `Auditable` y por tanto incluyen estas columnas:

| Columna | Tipo | Descripción |
| ------- | ---- | ----------- |
| `CREADO_POR` | VARCHAR(255) | Usuario que creó el registro. |
| `FECHA_CREACION` | TIMESTAMP | Fecha/hora de creación. |
| `ULTIMA_MODIFICACION_POR` | VARCHAR(255) | Último usuario que modificó. |
| `ULTIMA_MODIFICACION_DATE` | TIMESTAMP | Fecha/hora de la última modificación. |

> En las tablas siguientes se omiten estos campos por brevedad, pero **están presentes en todas**.

---

## 1. `USUARIO`

Usuarios del sistema. PK: `IDENTIFICACION`. `.getUsername()` usa el email.

| Columna | Tipo | Nulo | Descripción |
| ------- | ---- | ---- | ----------- |
| `IDENTIFICACION` | INT | No | **PK**. Número de documento de identidad (cédula). |
| `TIPO_IDENTIFICACION` | VARCHAR(20) | No | Tipo de documento. Enum: `TI`, `CC`, `NUIP`, `CE`, `P`. |
| `NOMBRE` | VARCHAR(255) | No | Nombre del usuario. |
| `APELLIDO` | VARCHAR(255) | No | Apellido del usuario. |
| `CONTRASEÑA` | VARCHAR(255) | No | Contraseña **cifrada con BCrypt**. |
| `CORREO` | VARCHAR(255) | No | Correo electrónico (único). Se usa como username. |
| `NUMERO_TELEFONO` | VARCHAR(255) | Sí | Número telefónico. |
| `DIRECCION` | VARCHAR(255) | Sí | Dirección residencial. |
| `FECHA_REGISTRO` | TIMESTAMP | Sí | Fecha de registro. |
| `ROL` | VARCHAR(20) | No | Rol. Enum: `ADMIN`, `OPERATOR`, `VIGILANTE`, `SUPERVISOR`, `USER`. |
| `ACTIVO` | BOOLEAN | Sí | Indica si la cuenta está activa (por defecto `true`). |

---

## 2. `PISO`

Niveles / pisos del parqueadero.

| Columna | Tipo | Nulo | Descripción |
| ------- | ---- | ---- | ----------- |
| `ID_PISO` | BIGSERIAL | No | **PK**. Identificador autogenerado. |
| `NUMERO_PISO` | INT | No | Número del piso (único). |
| `CAPACIDAD_TOTAL` | INT | Sí | Capacidad total de espacios del piso. |
| `ESPACIOS_DISponibles` | INT | Sí | Espacios disponibles actualmente. |

> Se relaciona con `ESPACIO` (1:N) y con `ZONA` (1:N).

---

## 3. `ZONA`

Zonas o sectores dentro de un piso.

| Columna | Tipo | Nulo | Descripción |
| ------- | ---- | ---- | ----------- |
| `ID_ZONA` | BIGSERIAL | No | **PK**. Identificador autogenerado. |
| `NOMBRE_ZONA` | VARCHAR(255) | No | Nombre de la zona. |
| `DESCRIPCION` | VARCHAR(255) | Sí | Descripción de la zona. |
| `ID_PISO` | BIGINT | Sí | **FK** → `PISO.ID_PISO`. Piso al que pertenece. |

---

## 4. `ESPACIO`

Espacios de parqueo.

| Columna | Tipo | Nulo | Descripción |
| ------- | ---- | ---- | ----------- |
| `ID_ESPACIO` | BIGSERIAL | No | **PK**. Identificador autogenerado. |
| `NUMERO_ESPACIO` | INT | No | Número del espacio. |
| `ESTADO` | VARCHAR(20) | No | Enum: `DISPONIBLE`, `OCUPADO`, `RESERVADO`, `MANTENIMIENTO`. |
| `TIPO_ESPACIO` | VARCHAR(20) | No | Enum: `ESTANDAR`, `DISCAPACIDAD`, `FAMILIA`, `ELECTRICO`. |
| `DIMENSIONES` | VARCHAR(255) | Sí | Dimensiones del espacio. |
| `ID_PISO` | BIGINT | Sí | **FK** → `PISO.ID_PISO`. |
| `ID_ZONA` | BIGINT | Sí | **FK** → `ZONA.ID_ZONA`. |

---

## 5. `VEHICULO`

Vehículos registrados. PK: `PLACA_VEHICULO` (String).

| Columna | Tipo | Nulo | Descripción |
| ------- | ---- | ---- | ----------- |
| `PLACA_VEHICULO` | VARCHAR(255) | No | **PK**. Placa del vehículo. |
| `TIPO_VEHICULO` | VARCHAR(20) | Sí | Enum: `AUTO`, `MOTO`, `CAMIONETA`, `CAMION`, `BUS`, `BICICLETA`. |
| `MARCA_VEHICULO` | VARCHAR(255) | Sí | Marca del vehículo. |
| `COLOR_VEHICULO` | VARCHAR(255) | Sí | Color del vehículo. |
| `TARJETA_PROPIEDAD` | VARCHAR(255) | Sí | Tarjeta de propiedad. |
| `HORA_ENTRADA` | TIMESTAMP | Sí | Fecha/hora de entrada. |
| `HORA_SALIDA` | TIMESTAMP | Sí | Fecha/hora de salida. |
| `ID_USUARIO` | INT | Sí | **FK** → `USUARIO.IDENTIFICACION`. Dueño del vehículo. |

---

## 6. `TICKET`

Registro de entrada/salida de un vehículo en un espacio.

| Columna | Tipo | Nulo | Descripción |
| ------- | ---- | ---- | ----------- |
| `ID_TICKET` | BIGSERIAL | No | **PK**. Identificador autogenerado. |
| `PLACA_VEHICULO` | VARCHAR(255) | Sí | **FK** → `VEHICULO.PLACA_VEHICULO`. |
| `ID_ESPACIO` | BIGINT | Sí | **FK** → `ESPACIO.ID_ESPACIO`. |
| `FECHA_HORA_ENTRADA` | TIMESTAMP | No | Fecha/hora de ingreso. |
| `FECHA_HORA_SALIDA` | TIMESTAMP | Sí | Fecha/hora de salida. |
| `TIEMPO_TOTAL_MINUTOS` | BIGINT | Sí | Duración total en minutos (se calcula al cerrar). |
| `VALOR_TOTAL` | NUMERIC(12,2) | Sí | Monto total a pagar. |
| `ESTADO` | VARCHAR(20) | No | Enum: `ACTIVO`, `FINALIZADO`, `CANCELADO`. |

---

## 7. `RESERVA`

Reservas de espacios realizadas por usuarios.

| Columna | Tipo | Nulo | Descripción |
| ------- | ---- | ---- | ----------- |
| `ID_RESERVA` | BIGSERIAL | No | **PK**. Identificador autogenerado. |
| `ID_USUARIO` | INT | No | **FK** → `USUARIO.IDENTIFICACION`. |
| `ID_ESPACIO` | BIGINT | No | **FK** → `ESPACIO.ID_ESPACIO`. |
| `FECHA_HORA_INICIO` | TIMESTAMP | No | Inicio de la reserva. |
| `FECHA_HORA_FIN` | TIMESTAMP | No | Fin de la reserva. |
| `ESTADO` | VARCHAR(20) | No | Enum: `PENDIENTE`, `CONFIRMADA`, `CANCELADA`, `CUMPLIDA`. |
| `MONTO_RESERVA` | NUMERIC(12,2) | Sí | Monto de la reserva. |

---

## 8. `TARIFA`

Tarifas configurables por tipo de vehículo.

| Columna | Tipo | Nulo | Descripción |
| ------- | ---- | ---- | ----------- |
| `ID_TARIFA` | BIGSERIAL | No | **PK**. Identificador autogenerado. |
| `TIPO_VEHICULO` | VARCHAR(20) | No | Tipo de vehículo (enum `VehicleType`). |
| `PRECIO_HORA` | NUMERIC(12,2) | Sí | Precio por hora. |
| `PRECIO_FRACCION` | NUMERIC(12,2) | Sí | Precio por fracción. |
| `PRECIO_DIA` | NUMERIC(12,2) | Sí | Precio por día. |
| `PRECIO_MES` | NUMERIC(12,2) | Sí | Precio por mes. |
| `PRECIO_ANIO` | NUMERIC(12,2) | Sí | Precio por año. |
| `FECHA_VIGENCIA_INICIO` | DATE | Sí | Inicio de vigencia de la tarifa. |
| `FECHA_VIGENCIA_FIN` | DATE | Sí | Fin de vigencia de la tarifa. |

---

## 9. `PAGO`

Pagos asociados a tickets. Relación **1:1** con `TICKET` (`ID_TICKET` único).

| Columna | Tipo | Nulo | Descripción |
| ------- | ---- | ---- | ----------- |
| `ID_PAGO` | BIGSERIAL | No | **PK**. Identificador autogenerado. |
| `ID_TICKET` | BIGINT | Sí | **FK** → `TICKET.ID_TICKET` (único). |
| `MONTO_TOTAL` | NUMERIC(12,2) | No | Monto del pago. |
| `METODO_PAGO` | VARCHAR(20) | No | Enum: `EFECTIVO`, `TARJETA`, `APP`, `QR`. |
| `FECHA_HORA_PAGO` | TIMESTAMP | Sí | Fecha/hora del pago. |
| `ESTADO_PAGO` | VARCHAR(20) | No | Enum: `PENDIENTE`, `PAGADO`, `CANCELADO`. |
| `REFERENCIA_TRANSACCION` | VARCHAR(255) | Sí | Referencia de la transacción (p. ej. Mercado Pago). |

---

## 10. `ABONO`

Abonos / mensualidades / suscripciones de usuarios.

| Columna | Tipo | Nulo | Descripción |
| ------- | ---- | ---- | ----------- |
| `ID_ABONO` | BIGSERIAL | No | **PK**. Identificador autogenerado. |
| `ID_USUARIO` | INT | No | **FK** → `USUARIO.IDENTIFICACION`. |
| `PLACA_VEHICULO` | VARCHAR(255) | Sí | **FK** → `VEHICULO.PLACA_VEHICULO`. |
| `TIPO_ABONO` | VARCHAR(20) | No | Enum: `MENSUAL`, `TRIMESTRAL`, `ANUAL`. |
| `FECHA_INICIO` | DATE | No | Inicio del abono. |
| `FECHA_FIN` | DATE | No | Fin del abono. |
| `MONTO` | NUMERIC(12,2) | Sí | Monto del abono. |
| `ESTADO` | VARCHAR(20) | No | Enum: `ACTIVO`, `VENCIDO`, `CANCELADO`. |

---

## 11. `INCIDENTE`

Incidentes reportados en el parqueadero.

| Columna | Tipo | Nulo | Descripción |
| ------- | ---- | ---- | ----------- |
| `ID_INCIDENTE` | BIGSERIAL | No | **PK**. Identificador autogenerado. |
| `ID_ESPACIO` | BIGINT | Sí | **FK** → `ESPACIO.ID_ESPACIO`. |
| `PLACA_VEHICULO` | VARCHAR(255) | Sí | **FK** → `VEHICULO.PLACA_VEHICULO`. |
| `FECHA_HORA` | TIMESTAMP | No | Fecha/hora del incidente. |
| `TIPO_INCIDENTE` | VARCHAR(20) | No | Enum: `DANIO`, `ROBO`, `ACCIDENTE`, `OTRO`. |
| `DESCRIPCION` | VARCHAR(1000) | Sí | Descripción del incidente. |
| `ESTADO` | VARCHAR(20) | No | Enum: `REPORTADO`, `EN_PROCESO`, `RESUELTO`. |

---

## Relaciones principales

| Origen | Cardinalidad | Destino | Clave foránea |
| ------ | ------------ | ------- | ------------- |
| `USUARIO` | 1 → N | `VEHICULO` | `VEHICULO.ID_USUARIO` |
| `PISO` | 1 → N | `ZONA` | `ZONA.ID_PISO` |
| `PISO` | 1 → N | `ESPACIO` | `ESPACIO.ID_PISO` |
| `ZONA` | 1 → N | `ESPACIO` | `ESPACIO.ID_ZONA` |
| `VEHICULO` | 1 → N | `TICKET` | `TICKET.PLACA_VEHICULO` |
| `ESPACIO` | 1 → N | `TICKET` | `TICKET.ID_ESPACIO` |
| `USUARIO` | 1 → N | `RESERVA` | `RESERVA.ID_USUARIO` |
| `ESPACIO` | 1 → N | `RESERVA` | `RESERVA.ID_ESPACIO` |
| `TICKET` | 1 → 1 | `PAGO` | `PAGO.ID_TICKET` (único) |
| `USUARIO` | 1 → N | `ABONO` | `ABONO.ID_USUARIO` |
| `VEHICULO` | 1 → N | `ABONO` | `ABONO.PLACA_VEHICULO` |
| `ESPACIO` | 1 → N | `INCIDENTE` | `INCIDENTE.ID_ESPACIO` |
| `VEHICULO` | 1 → N | `INCIDENTE` | `INCIDENTE.PLACA_VEHICULO` |

---

## Enums de referencia

| Enum | Valores |
| ---- | ------- |
| `Role` | `ADMIN`, `OPERATOR`, `VIGILANTE`, `SUPERVISOR`, `USER` |
| `IdentificationType` | `TI`, `CC`, `NUIP`, `CE`, `P` |
| `SpaceState` | `DISPONIBLE`, `OCUPADO`, `RESERVADO`, `MANTENIMIENTO` |
| `SpaceType` | `ESTANDAR`, `DISCAPACIDAD`, `FAMILIA`, `ELECTRICO` |
| `VehicleType` | `AUTO`, `MOTO`, `CAMIONETA`, `CAMION`, `BUS`, `BICICLETA` |
| `TicketState` | `ACTIVO`, `FINALIZADO`, `CANCELADO` |
| `ReservationState` | `PENDIENTE`, `CONFIRMADA`, `CANCELADA`, `CUMPLIDA` |
| `PaymentState` | `PENDIENTE`, `PAGADO`, `CANCELADO` |
| `PaymentMethod` | `EFECTIVO`, `TARJETA`, `APP`, `QR` |
| `SubscriptionState` | `ACTIVO`, `VENCIDO`, `CANCELADO` |
| `SubscriptionType` | `MENSUAL`, `TRIMESTRAL`, `ANUAL` |
| `IncidentState` | `REPORTADO`, `EN_PROCESO`, `RESUELTO` |
| `IncidentType` | `DANIO`, `ROBO`, `ACCIDENTE`, `OTRO` |

> Los enums se persisten como **cadena** (`@Enumerated(EnumType.STRING)`). Espejo en frontend: `frontend/src/services/index.js` → `ENUMS`.
