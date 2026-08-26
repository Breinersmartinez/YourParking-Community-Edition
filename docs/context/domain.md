# Domain — modelo de dominio

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

**Estado: TODO el contenido de este documento es `[DOCUMENTADO]` (espec ETFv1 FASE 1–6). Ninguna entidad, servicio ni evento existe en código hoy — ver [modules.md](modules.md).**

## Bounded contexts y agregados

| BC | Agregados / entidades | Value Objects |
|---|---|---|
| Gestión de Clientes | `Cliente` (raíz), `Vehiculo`, `VehiculoClienteHistorial` | `Placa` |
| Mensualidades y Cobranza | `Mensualidad` (raíz), `Periodo`, `Pago` (raíz propio), `AplicacionPago` (N:M) | `Dinero` (BigDecimal, nunca float), `RangoVigencia`, `EstadoPeriodo` |
| Parqueo Transitorio | `Movimiento` (única entidad, `hora_salida` nullable), `CapacidadParqueadero` (contador) | `ModalidadCobro` (`POR_DIA`/`POR_HORA`) |
| Tarifas | `TarifaMensualidad`, `TarifaVisitante` (versionadas), `TipoVehiculo` (catálogo abierto) | |
| Identidad y Seguridad | `Usuario` (raíz), `Rol` + `Permiso` + `RolPermiso` (N:M), `Auditoria` (append-only) | |
| Reporting | proyecciones no persistentes (Dashboard, Reporte) | |

Fuente canónica de atributos por tabla: `docs/ETFv1/FASE 3 — MODELO DE DATOS.md`; actualización de roles/permisos: `docs/ETFv1/Actualización — Roles y Permisos.md`.

## Servicios de dominio previstos

- `CalculadorDeCobro` — Strategy con dos estrategias: `CalculoCobroPorDia` (plano, mínimo 1 día, supuesto 24 h desde ingreso) y `CalculoCobroPorHora` (fracción de hora con tope diario).
- `CalculadorDeEstadoMensualidad` — deriva `EstadoPeriodo` (`AL_DIA/PENDIENTE/EN_MORA/PAGADO_ANTICIPADO`/parcial) desde montos + pagos aplicados + fecha; **el estado nunca se persiste editable**.
- `AsignadorDeCupo` — reserva/liberación transaccional con `SELECT ... FOR UPDATE` sobre capacidad.
- `GeneradorDePeriodos` — crea el `Periodo` mensual de cada mensualidad activa.

## Eventos de dominio (candidatos)

`ClienteRegistrado`, `VehiculoAsociado`, `MensualidadCreada`, `PeriodoGenerado`, `PagoRegistrado`, `PeriodoVencido`, `MensualidadSuspendida`, `MensualidadCancelada`, `VehiculoIngreso`, `VehiculoSalida`, `CupoAgotado`, `TarifaActualizada`, `UsuarioCreado`. Consumidores previstos: auditoría, notificaciones, reporting. Publicación in-process sin outbox (decisión D8).

## Estados y transiciones

- `Mensualidad`: ACTIVA ↔ SUSPENDIDA → CANCELADA (enum cerrado controlado por casos de uso).
- `Periodo`: estado derivado en consulta (pendiente/parcial/pagado/en mora según pagos + vencimiento) — nunca columna editable.
- `Movimiento`: EnParqueadero → Finalizado | Anulado (anulación lógica).

## Casos de uso

23 casos de uso definidos (UC1–UC23) en ETFv1 FASE 2 §2, priorizados en backlog HU-001…HU-034 (`FASE 6 — BACKLOG.md`). Ejemplo de referencia de diseño completo: `RegistrarPago` (FASE 5 §3).

## Referencias

- [business-rules.md](business-rules.md) — reglas RN1–RN13
- [database.md](database.md) — materialización relacional prevista
