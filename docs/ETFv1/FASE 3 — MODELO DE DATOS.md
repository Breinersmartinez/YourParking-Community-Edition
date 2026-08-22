
# FASE 3 — MODELO DE DATOS

## 0. Notas antes del modelo

- Confirmaste `[DECISIÓN PENDIENTE 10]` → Alternativa A: **sí se registra `Movimiento` para clientes mensuales** (sin cobro), lo cual también alimenta directamente `Auditoria` por RN10. Queda resuelta.
- `[DECISIÓN PENDIENTE 11]` (día calendario vs. 24h) no la respondiste aún — avanzo con el **supuesto** de "24 horas desde el ingreso, redondeando hacia arriba", documentado como `[SUPUESTO]` en `TarifaVisitante`/`Movimiento`.
- `[DECISIÓN PENDIENTE 8]` (cupos numerados vs. capacidad por contador) sigue abierta — modelo con **contador de capacidad por tipo de vehículo** (más simple, sin sobreingeniería), fácilmente migrable a cupos numerados después si me confirmas que sí existen espacios físicos señalizados.
- Motor recomendado: **PostgreSQL** — RECOMENDACIÓN, justificación en el punto 8 de esta fase.

---

## 1. Diagrama Entidad-Relación

```mermaid
erDiagram
    CLIENTE ||--o{ VEHICULO : "posee actualmente"
    CLIENTE ||--o{ VEHICULO_CLIENTE_HISTORIAL : "historial de tenencia"
    VEHICULO ||--o{ VEHICULO_CLIENTE_HISTORIAL : "registrado en"
    VEHICULO ||--o{ MENSUALIDAD : "tiene"
    CLIENTE ||--o{ MENSUALIDAD : "titular"
    TIPO_VEHICULO ||--o{ VEHICULO : "clasifica"
    TIPO_VEHICULO ||--o{ TARIFA_MENSUALIDAD : "aplica a"
    TIPO_VEHICULO ||--o{ TARIFA_VISITANTE : "aplica a"
    TIPO_VEHICULO ||--o{ CAPACIDAD_PARQUEADERO : "define"
    TARIFA_MENSUALIDAD ||--o{ MENSUALIDAD : "vigente al crear"
    MENSUALIDAD ||--o{ PERIODO : "genera"
    PERIODO ||--o{ APLICACION_PAGO : "recibe"
    PAGO ||--o{ APLICACION_PAGO : "se distribuye en"
    PAGO }o--o| MOVIMIENTO : "cobra (visitante)"
    TARIFA_VISITANTE ||--o{ MOVIMIENTO : "vigente al calcular"
    VEHICULO ||--o{ MOVIMIENTO : "protagoniza"
    TIPO_VEHICULO ||--o{ MOVIMIENTO : "clasifica"
    USUARIO ||--o{ PAGO : "registra"
    USUARIO ||--o{ MOVIMIENTO : "registra"
    USUARIO ||--o{ AUDITORIA : "genera"
    USUARIO }o--|| ROL : "tiene"
    USUARIO ||--o{ TARIFA_MENSUALIDAD : "crea"
    USUARIO ||--o{ TARIFA_VISITANTE : "crea"

    CLIENTE {
        bigint id PK
        varchar documento_identidad UK
        varchar tipo_documento
        varchar nombre_completo
        varchar telefono
        varchar direccion
        timestamp fecha_registro
        boolean activo
        bigint creado_por FK
    }
    VEHICULO {
        bigint id PK
        varchar placa UK
        bigint tipo_vehiculo_id FK
        varchar color
        bigint cliente_id FK "nullable"
        boolean activo
    }
    VEHICULO_CLIENTE_HISTORIAL {
        bigint id PK
        bigint vehiculo_id FK
        bigint cliente_id FK
        timestamp fecha_inicio
        timestamp fecha_fin "nullable"
        bigint registrado_por FK
    }
    TIPO_VEHICULO {
        bigint id PK
        varchar nombre UK
        boolean activo
    }
    MENSUALIDAD {
        bigint id PK
        bigint vehiculo_id FK
        bigint cliente_id FK
        bigint tarifa_mensualidad_id FK
        numeric monto_mensual
        date fecha_inicio
        int dia_vencimiento
        varchar estado
        bigint creado_por FK
        timestamp fecha_creacion
    }
    PERIODO {
        bigint id PK
        bigint mensualidad_id FK
        date anio_mes
        numeric monto
        date fecha_vencimiento
        timestamp fecha_generacion
    }
    PAGO {
        bigint id PK
        numeric monto_total
        varchar origen
        bigint movimiento_id FK "nullable"
        timestamp fecha_pago
        varchar metodo_pago
        bigint registrado_por FK
        boolean anulado
        varchar motivo_anulacion
    }
    APLICACION_PAGO {
        bigint id PK
        bigint pago_id FK
        bigint periodo_id FK
        numeric monto_aplicado
    }
    TARIFA_MENSUALIDAD {
        bigint id PK
        bigint tipo_vehiculo_id FK
        numeric monto_mensual
        date vigencia_desde
        date vigencia_hasta "nullable"
        bigint creado_por FK
    }
    TARIFA_VISITANTE {
        bigint id PK
        bigint tipo_vehiculo_id FK
        varchar modalidad_cobro
        numeric monto_dia
        numeric monto_hora
        numeric tope_maximo_diario
        date vigencia_desde
        date vigencia_hasta "nullable"
        bigint creado_por FK
    }
    MOVIMIENTO {
        bigint id PK
        bigint vehiculo_id FK "nullable"
        varchar placa_capturada
        bigint tipo_vehiculo_id FK
        boolean es_cliente_mensual
        timestamp hora_ingreso
        timestamp hora_salida "nullable"
        bigint tarifa_visitante_id FK "nullable"
        numeric monto_cobrado "nullable"
        bigint registrado_por_ingreso FK
        bigint registrado_por_salida FK "nullable"
        boolean anulado
    }
    CAPACIDAD_PARQUEADERO {
        bigint id PK
        bigint tipo_vehiculo_id FK UK
        int capacidad_total
    }
    USUARIO {
        bigint id PK
        varchar nombre_usuario UK
        varchar password_hash
        bigint rol_id FK
        boolean activo
        timestamp fecha_creacion
        timestamp ultimo_login
    }
    ROL {
        bigint id PK
        varchar nombre UK
    }
    AUDITORIA {
        bigint id PK
        bigint usuario_id FK
        varchar accion
        varchar entidad
        bigint entidad_id
        timestamp fecha_hora
        varchar resultado
        text detalle
    }
```

---

## 2. Detalle por entidad

### CLIENTE
| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| id | bigint | sí | PK |
| documento_identidad | varchar(30) | sí | **UNIQUE** — corrige hallazgo L de Fase 1 (nombres duplicados como "Jairo") |
| tipo_documento | varchar(20) | sí | catálogo simple: CC, CE, PASAPORTE, NIT — `[SUPUESTO]`, ajustar si aplica otro |
| nombre_completo | varchar(150) | sí | |
| telefono | varchar(20) | no | |
| direccion | varchar(200) | no | |
| fecha_registro | timestamp | sí | default now() |
| activo | boolean | sí | default true — desactivación lógica, nunca DELETE físico (RN9) |
| creado_por | bigint FK→Usuario | sí | trazabilidad |

### VEHICULO
| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| id | bigint | sí | PK |
| placa | varchar(10) | sí | **UNIQUE** — clave natural del vehículo |
| tipo_vehiculo_id | bigint FK | sí | |
| color | varchar(30) | no | separa color de tipo (corrige hallazgo D de Fase 1: `MOTO (Rojo)`) |
| cliente_id | bigint FK | **no** | nullable a propósito — un vehículo de visitante ocasional puede no tener cliente asociado |
| activo | boolean | sí | |

**`VEHICULO_CLIENTE_HISTORIAL`** existe aparte para no perder el histórico cuando `cliente_id` cambia (RN2/RN3): cada cambio cierra la fila anterior (`fecha_fin`) y crea una nueva, en vez de sobrescribir.

### MENSUALIDAD
| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| id | bigint | sí | PK |
| vehiculo_id | bigint FK | sí | |
| cliente_id | bigint FK | sí | **denormalizado intencionalmente**: preserva quién era el titular al crear la mensualidad, aunque el vehículo cambie de dueño después |
| tarifa_mensualidad_id | bigint FK | sí | tarifa vigente al momento de crear |
| monto_mensual | numeric(12,2) | sí | **snapshot** del monto — nunca se recalcula si la tarifa cambia después (RN6) |
| fecha_inicio | date | sí | |
| dia_vencimiento | int (1-31) | sí | `[SUPUESTO]` — necesito confirmar la regla real de vencimiento (decisión pendiente 4, aún abierta) |
| estado | varchar/enum | sí | `ACTIVA`, `SUSPENDIDA`, `CANCELADA` — **este sí es un enum cerrado y controlado por casos de uso, no texto libre**, distinto del estado de pago del Periodo |
| creado_por | bigint FK | sí | |

**Constraint clave:** índice único parcial `UNIQUE(vehiculo_id) WHERE estado = 'ACTIVA'` → garantiza que un vehículo no tenga dos mensualidades activas simultáneas.

### PERIODO
| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| id | bigint | sí | PK |
| mensualidad_id | bigint FK | sí | |
| anio_mes | date (día 1 del mes) | sí | representa el mes cubierto |
| monto | numeric(12,2) | sí | snapshot del monto de la mensualidad al generarse (protege de cambios posteriores de tarifa) |
| fecha_vencimiento | date | sí | |
| fecha_generacion | timestamp | sí | |

**No tiene columna `estado` ni `saldo_pendiente`** — ambos se derivan en consulta (RN11 + respuesta de arriba). Constraint: `UNIQUE(mensualidad_id, anio_mes)` evita duplicar el mismo mes dos veces.

### PAGO
| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| id | bigint | sí | PK |
| monto_total | numeric(12,2) | sí | CHECK > 0 |
| origen | varchar/enum | sí | `MENSUALIDAD` \| `VISITANTE` — determina si se distribuye vía `AplicacionPago` o va ligado a un `Movimiento` |
| movimiento_id | bigint FK | no | solo si `origen = VISITANTE` |
| fecha_pago | timestamp | sí | |
| metodo_pago | varchar/enum | sí | catálogo: `EFECTIVO`, `TRANSFERENCIA` — **ya no texto libre**, corrige hallazgo B de Fase 1 |
| registrado_por | bigint FK | sí | |
| anulado | boolean | sí | default false — anulación lógica, nunca DELETE (RN9) |
| motivo_anulacion | text | no | |

### APLICACION_PAGO (tabla intermedia N:M)
| Campo | Tipo | Notas |
|---|---|---|
| id | bigint PK | |
| pago_id | bigint FK | |
| periodo_id | bigint FK | |
| monto_aplicado | numeric(12,2) | permite que **un pago cubra varios periodos** (RN5) y que un periodo se pague con varios pagos parciales |

Constraint: `UNIQUE(pago_id, periodo_id)`.

### TARIFA_MENSUALIDAD / TARIFA_VISITANTE
Separadas en dos tablas (en vez de una sola tabla "Tarifa" con muchas columnas nulas) porque tienen atributos y reglas distintas — evita "columnas nulas en su mayoría", más limpio y explícito.

`TARIFA_VISITANTE` incluye `modalidad_cobro` (`POR_DIA` \| `POR_HORA`), reflejando la información que confirmaste: hoy solo se usa `POR_DIA` con `monto_dia = 3000`, pero el sistema soporta `POR_HORA` desde ya.

Ambas tienen `vigencia_desde` / `vigencia_hasta` (nullable = vigente actual). **Constraint recomendado (PostgreSQL):** `EXCLUDE USING gist` sobre `(tipo_vehiculo_id, daterange(vigencia_desde, vigencia_hasta))` para que la base de datos **impida a nivel de motor** que existan dos tarifas vigentes solapadas para el mismo tipo de vehículo — no depender solo de validación en aplicación.

### MOVIMIENTO
| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| id | bigint | sí | PK |
| vehiculo_id | bigint FK | no | se enlaza si es un vehículo ya registrado (cliente mensual) |
| placa_capturada | varchar(10) | sí | **siempre se captura**, incluso si no hay `Vehiculo` (visitante nuevo sin registro previo) |
| tipo_vehiculo_id | bigint FK | sí | |
| es_cliente_mensual | boolean | sí | fijado al crear, según si `vehiculo_id` tiene mensualidad activa vigente en ese momento |
| hora_ingreso | timestamp | sí | |
| hora_salida | timestamp | no | null = vehículo actualmente dentro |
| tarifa_visitante_id | bigint FK | no | solo si aplica cobro (no mensual) |
| monto_cobrado | numeric(12,2) | no | snapshot calculado al registrar salida |
| registrado_por_ingreso / salida | bigint FK | sí/no | trazabilidad de qué operador registró cada evento |
| anulado | boolean | sí | |

Índice recomendado: parcial `WHERE hora_salida IS NULL` → resuelve rápidamente "¿quién está adentro ahora mismo?" y detecta vehículos que nunca registraron salida (caso mencionado en el análisis original).

### CAPACIDAD_PARQUEADERO
Solo un contador de capacidad total por tipo de vehículo (`UNIQUE(tipo_vehiculo_id)`). La ocupación actual **no se almacena** — se calcula como `COUNT(Movimiento WHERE hora_salida IS NULL AND tipo_vehiculo_id = X)`, evitando el clásico bug de un contador que se desincroniza. El control de concurrencia (para no exceder capacidad con ingresos simultáneos) se resuelve con bloqueo transaccional, detallado en Fase 4/5.

### USUARIO / ROL / AUDITORIA
Estándar. `Rol` es catálogo cerrado (`ADMINISTRADOR`, `OPERADOR`) por ahora, según RECOMENDACIÓN ya aceptada en Fase 2. `Auditoria` es **append-only**: a nivel de base de datos, el rol/usuario de la aplicación no debe tener permisos `UPDATE`/`DELETE` sobre esta tabla — se define en Fase 4 (seguridad) y Fase 8 (DevOps).

---

## 3. Normalización

El modelo está en **3FN** con denormalización **intencional y justificada** en tres puntos, todos para preservar integridad histórica (regla 27 y RN6 del análisis original):

1. `Mensualidad.cliente_id` — redundante con `Vehiculo.cliente_id`, pero necesario porque el titular al crear la mensualidad puede no ser el dueño actual del vehículo más adelante.
2. `Mensualidad.monto_mensual` y `Periodo.monto` — snapshots del monto vigente, para que un cambio de tarifa nunca altere periodos ya generados.
3. `Movimiento.tarifa_visitante_id` + `monto_cobrado` — snapshot del cobro calculado, igual razón.

Ninguna otra redundancia existe: se eliminó la duplicación de "un cliente por hoja mensual" del Excel (ahora `Cliente`/`Vehiculo`/`Mensualidad` existen una sola vez y `Periodo` es lo que se genera cada mes), y se eliminó la hoja "Deudores" como tabla separada (ahora es una consulta, no una tabla).

## 4. Índices y constraints clave (resumen)

- `Cliente.documento_identidad` — UNIQUE
- `Vehiculo.placa` — UNIQUE
- `Mensualidad` — índice único parcial `(vehiculo_id) WHERE estado='ACTIVA'`
- `Periodo` — UNIQUE `(mensualidad_id, anio_mes)`
- `AplicacionPago` — UNIQUE `(pago_id, periodo_id)`
- `TarifaMensualidad`/`TarifaVisitante` — EXCLUDE sin solapamiento de vigencia por `tipo_vehiculo_id`
- `Movimiento` — índice parcial `WHERE hora_salida IS NULL`
- `CapacidadParqueadero.tipo_vehiculo_id` — UNIQUE
- `Usuario.nombre_usuario` — UNIQUE
- Todas las FK con `ON DELETE RESTRICT` (nunca `CASCADE` en datos financieros/históricos — RN9)

## 5. Histórico y auditoría — resumen de la estrategia

| Situación | Estrategia |
|---|---|
| Cambio de dueño de vehículo | Nueva fila en `VehiculoClienteHistorial`, se actualiza `Vehiculo.cliente_id` |
| Cambio de tarifa | Nueva fila en `TarifaMensualidad`/`TarifaVisitante`, se cierra `vigencia_hasta` de la anterior — nunca se edita una tarifa pasada |
| Pago erróneo | Se marca `anulado=true` con `motivo_anulacion`, nunca se borra (RN9) |
| Cliente se retira con saldo | Pendiente definir regla exacta — `[DECISIÓN PENDIENTE 9]`, sigue abierta |
| Toda operación crítica | Genera fila en `Auditoria` (RN10) — inmutable a nivel de permisos de base de datos |

## 6. Migración del Excel — mapeo preliminar de columnas

| Columna Excel | Entidad/campo destino | Tratamiento |
|---|---|---|
| Nombre | `Cliente.nombre_completo` | Requiere pedir documento de identidad para completar el registro — dato faltante crítico |
| Placa_Del_Vehiculo | `Vehiculo.placa` | Normalizar mayúsculas/espacios; filas sin placa quedan pendientes de completar manualmente antes de migrar |
| Tipo_Vehiculo | `Vehiculo.tipo_vehiculo_id` + `Vehiculo.color` | Separar texto tipo `"MOTO (Rojo)"` en tipo=`MOTO` + color=`Rojo` |
| Fecha_Ingreso | `Mensualidad.fecha_inicio` (supuesto, a confirmar) | Pendiente decisión 2 |
| Fecha_vencimiento_pago | `Periodo.fecha_vencimiento` | Pendiente decisión 2 — reconstruir criterio antes de migrar en masa |
| Estado_Del_Pago | **no se migra literal** | Se reconstruye `EstadoPeriodo` a partir de `Monto_Pagado` vs `Monto_Mensual` |
| Monto_Mensual | `Mensualidad.monto_mensual` / `Periodo.monto` | |
| Monto_Pagado | `Pago.monto_total` (+ `AplicacionPago`) | Un registro de pago por celda con valor, ligado al `Periodo` de esa hoja/mes |
| Metodo_De_Pago | `Pago.metodo_pago` | Normalizar a catálogo cerrado (`EFECTIVO`/`TRANSFERENCIA`), casos nulos quedan como pendiente de aclarar |
| Hoja "Deudores" | **no se migra como tabla** | Se descarta; el estado de deuda se recalculará desde `Periodo`+`Pago` migrados |

Esta migración se detalla completamente (script, validaciones, casos dudosos) en una fase posterior de implementación — aquí solo dejo el mapeo conceptual.

---

## 7. Decisiones pendientes que siguen abiertas

Sin cambios respecto a las anteriores, siguen bloqueando detalles antes de implementación (no bloquean seguir a Fase 4):
- **[DECISIÓN PENDIENTE 2]** significado exacto de `Fecha_Ingreso`/`Fecha_vencimiento_pago` en el Excel actual (afecta cómo migrar, no el modelo nuevo en sí).
- **[DECISIÓN PENDIENTE 4]** regla exacta de vencimiento mensual, capacidad total del parqueadero por tipo de vehículo.
- **[DECISIÓN PENDIENTE 8]** confirmar si existen cupos físicos numerados o solo capacidad total (afecta si `CapacidadParqueadero` es suficiente o se necesita una entidad `Cupo` individual).
- **[DECISIÓN PENDIENTE 9]** qué pasa si un cliente se retira con saldo pendiente.
- **[DECISIÓN PENDIENTE 11]** confirmar "24h desde ingreso" vs. "día calendario" para el cobro de visitantes (avancé con supuesto).

## 8. Motor de base de datos — RECOMENDACIÓN

**PostgreSQL**, por:
- Soporte nativo de `EXCLUDE USING gist` con `daterange` (clave para evitar solapamiento de tarifas sin lógica extra en aplicación).
- Constraints parciales (`UNIQUE ... WHERE`) usados varias veces arriba.
- Costo cero de licenciamiento, ecosistema maduro, y es más que suficiente para el volumen real del negocio (no se necesita MySQL ni motores distribuidos).

---
