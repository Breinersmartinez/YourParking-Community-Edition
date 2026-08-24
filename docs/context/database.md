# Database — modelo de datos

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

## Estado real — `[CONFIRMADO]`

- Motor: PostgreSQL 16 (`postgres:16-alpine` en docker-compose; driver `org.postgresql` en pom).
- **El esquema NO existe**: `db/parking_management.sql` está vacío (0 bytes). Docker Compose lo monta como init script (`/docker-entrypoint-initdb.d/01_init.sql`) pero al estar vacío no crea nada.
- No hay entidades JPA ni repositorios en el código. No hay Flyway/Liquibase en el pom, pese a que ETFv1 FASE 4 §5 exige migraciones versionadas.
- Hibernate: dialecto fijado a PostgreSQL, naming physical strategy estándar, `show-sql=true`, sin `ddl-auto` configurado (default `none`).

## Modelo previsto (espec ETFv1 FASE 3) — `[DOCUMENTADO]`

14 tablas: `CLIENTE`, `VEHICULO`, `VEHICULO_CLIENTE_HISTORIAL`, `TIPO_VEHICULO`, `MENSUALIDAD`, `PERIODO`, `PAGO`, `APLICACION_PAGO`, `TARIFA_MENSUALIDAD`, `TARIFA_VISITANTE`, `MOVIMIENTO`, `CAPACIDAD_PARQUEADERO`, `USUARIO`, `ROL`, `AUDITORIA` (+ `PERMISO`, `ROL_PERMISO` según la Actualización de Roles y Permisos).

ER completo con tipos columna por columna: `docs/ETFv1/FASE 3 — MODELO DE DATOS.md` §1.

### Constraints clave exigidos por la espec

| Constraint | Tabla | Motivo |
|---|---|---|
| UNIQUE `documento_identidad` | CLIENTE | identificador único de negocio |
| UNIQUE `placa` | VEHICULO | clave natural |
| Índice único parcial `(vehiculo_id) WHERE estado='ACTIVA'` | MENSUALIDAD | máx. 1 mensualidad activa |
| UNIQUE `(mensualidad_id, anio_mes)` | PERIODO | sin periodos duplicados |
| UNIQUE `(pago_id, periodo_id)` | APLICACION_PAGO | |
| `EXCLUDE USING gist` sobre rango de vigencia | TARIFAS | sin tarifas solapadas por tipo de vehículo |
| Índice parcial `WHERE hora_salida IS NULL` | MOVIMIENTO | "quién está adentro" |
| FK `ON DELETE RESTRICT` (nunca CASCADE) | todas | RN9 |

### Decisiones de persistencia

- Montos como `numeric(12,2)` (nunca float) `[DOCUMENTADO]`.
- Estados como enum cerrado en dominio + varchar controlado en BD.
- Denormalización intencional justificada: snapshots de monto (`Mensualidad.monto_mensual`, `Periodo.monto`, `Movimiento.monto_cobrado`) y `Mensualidad.cliente_id`.
- Ocupación del parqueadero calculada por consulta (`COUNT(movimientos abiertos)`), nunca contador almacenado.
- Auditoría append-only: el rol de aplicación no debe tener UPDATE/DELETE sobre `AUDITORIA`.

## Referencias

- [domain.md](domain.md) — agregados que estas tablas materializan
- [infrastructure.md](infrastructure.md) — cómo se inicializa Postgres hoy
