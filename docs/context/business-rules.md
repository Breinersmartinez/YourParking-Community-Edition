# Business Rules — reglas de negocio

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

**Todas las reglas de esta lista son `[DOCUMENTADO]`** (ETFv1 FASE 2 §6 + actualización "Nueva información de negocio"). Ninguna está implementada ni validada en código. Al implementar, la fuente es el dominio exclusivamente (no controllers/repositories).

| # | Regla | Origen |
|---|---|---|
| RN1 | Un cliente puede tener uno o más vehículos asociados. | Excel |
| RN2 | Un vehículo pertenece a un único cliente en un momento dado; puede cambiar de dueño conservando histórico (sin sobrescritura). | Recomendación ETFv1 |
| RN3 | Cambio de placa conserva historial de la placa anterior. | Requerimientos §6 |
| RN4 | Deuda = condición derivada de periodos vencidos con saldo > 0; no existe entidad "Deuda". | Recomendación (corrige hoja Excel "Deudores") |
| RN5 | Un `Pago` puede aplicarse a uno o varios `Periodo` vía `AplicacionPago`; distribución del más antiguo al más reciente. | Requerimientos §7 |
| RN6 | Un cambio de tarifa nunca altera cobros ya calculados (snapshot de montos). | Requerimientos §10 |
| RN7 | Cliente mensual con mensualidad activa: acceso libre e ilimitado sin cobro por movimiento. | Dueña del negocio |
| RN8 | El Operador no puede modificar tarifas, cupos, usuarios ni eliminar registros. | Requerimientos §17 |
| RN9 | Registros financieros y movimientos no se eliminan físicamente: anulación/desactivación lógica con histórico. | Requerimientos regla 26 |
| RN10 | Toda operación crítica genera registro de auditoría inmutable (append-only). | Requerimientos §18 |
| RN11 | El estado del `Periodo` se deriva de sus pagos y vencimiento; nunca texto libre editable. | Recomendación |
| RN12 | Tarifa visitante por defecto plana por día ($3.000 COP hoy); configurable por hora sin afectar históricos. | Dueña + recomendación |
| RN13 | Montos por día/hora configurables por el Administrador (`ConfigurarTarifa`), no valores fijos en código. | Recomendación |

## Supuestos vigentes que requieren confirmación del negocio

- Cobro "por día" = 24 h desde ingreso redondeando arriba (vs. día calendario) — `[DECISIÓN PENDIENTE 11]`.
- Cupo como contador de capacidad por tipo de vehículo (no espacios numerados) — `[DECISIÓN PENDIENTE 8]`.
- Qué pasa si un cliente se retira con saldo pendiente — `[DECISIÓN PENDIENTE 9]`, bloquea HU-018.
- Significado real de fechas del Excel para migración — `[DECISIÓN PENDIENTE 2]`.

Lista completa de decisiones pendientes: `docs/ETFv1/FASE 6 — BACKLOG.md` §14.

## Referencias

- [domain.md](domain.md) — entidades donde viven estas reglas
- [api.md](api.md) — permisos que gobiernan cada endpoint previsto
