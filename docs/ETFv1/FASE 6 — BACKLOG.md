# FASE 6 — BACKLOG

Organizo por Epic → Feature → Historia de Usuario → Criterios de aceptación, con priorización MoSCoW y separación clara del MVP (Fase 6 del documento original, sección 26).

---

## 1. Criterio de definición del MVP

El MVP cubre exactamente lo que el documento de requerimientos marcó como núcleo (sección 26): autenticación, clientes, vehículos, mensualidades, pagos, deudores (como vista derivada), parqueo por horas/día, cupos, tarifas, dashboard básico. Todo lo demás (notificaciones, backups automatizados, reportes avanzados) queda como `Should`/`Could` fuera del MVP estricto, aunque se diseñe la base desde ya (ya está en el modelo de datos).

---

## 2. Epics

| ID | Epic | Prioridad |
|---|---|---|
| E1 | Seguridad y Acceso | Must |
| E2 | Gestión de Clientes y Vehículos | Must |
| E3 | Mensualidades y Cobranza | Must |
| E4 | Parqueo Transitorio | Must |
| E5 | Tarifas y Capacidad | Must |
| E6 | Dashboard y Reportes | Should |
| E7 | Auditoría | Must (técnica, transversal) |
| E8 | Notificaciones | Could |
| E9 | Backups y Recuperación | Should |
| E10 | Migración del Excel | Must (una sola vez, no recurrente) |

---

## 3. E1 — Seguridad y Acceso

### Feature 1.1 — Autenticación

**HU-001** | Epic: E1 | Prioridad: Must
> Como usuario del sistema (Administrador u Operador), quiero iniciar sesión con usuario y contraseña, para acceder a las funciones según mi rol.

Criterios de aceptación:
- Dado un usuario activo con credenciales correctas, cuando inicia sesión, entonces recibe `accessToken`, `refreshToken`, `roles[]` y `permisos[]`.
- Dado un usuario inactivo o credenciales incorrectas, cuando intenta iniciar sesión, entonces recibe error `401` con `errorCode` específico, sin revelar si el usuario existe o no (protección contra enumeración).
- El `accessToken` expira en un tiempo configurable (definir valor en implementación).
- Existe rate limiting sobre `/auth/login` para mitigar fuerza bruta.

Reglas de negocio: RN8. Dependencias: ninguna (historia base).

**HU-002** | Epic: E1 | Prioridad: Must
> Como usuario autenticado, quiero renovar mi sesión con el refresh token, para no perder mi trabajo cuando expira el access token.

Criterios de aceptación:
- Dado un `refreshToken` válido y no expirado, cuando se solicita `/auth/refresh`, entonces se emite un nuevo `accessToken`.
- Dado un `refreshToken` expirado o revocado, entonces se rechaza y se exige nuevo login.

**HU-003** | Epic: E1 | Prioridad: Should
> Como usuario autenticado, quiero cerrar sesión explícitamente, para invalidar mis tokens si uso un equipo compartido.

### Feature 1.2 — Gestión de usuarios, roles y permisos

**HU-004** | Epic: E1 | Prioridad: Must
> Como Administrador, quiero crear usuarios operadores, para que puedan operar el sistema sin compartir mi cuenta.

Criterios de aceptación:
- Solo un usuario con `USUARIOS_CREATE` puede ejecutar esta acción.
- El usuario se crea con contraseña hasheada (nunca texto plano), asociado a un rol existente.
- Se genera un registro de auditoría (`UsuarioCreado`).

Reglas de negocio: RN8, RN10. Dependencias: HU-006 (roles deben existir primero, vía datos semilla).

**HU-005** | Epic: E1 | Prioridad: Must
> Como Administrador, quiero inactivar un usuario, para revocar su acceso sin perder el historial de sus acciones pasadas.

Criterios de aceptación:
- Un usuario inactivo no puede iniciar sesión.
- No se elimina físicamente (RN9); se conserva para trazabilidad de auditoría.

**HU-006** | Epic: E1 | Prioridad: Must
> Como Administrador, quiero crear roles y asignarles permisos, para adaptar el acceso sin modificar código.

Criterios de aceptación:
- Un rol tiene nombre único y una lista de permisos del catálogo cerrado (Fase 4 actualizada).
- No se puede eliminar un rol con usuarios activos asignados (validación de negocio, no FK cascada — RN9).

**HU-007 (técnica)** | Epic: E1 | Prioridad: Must
> Como sistema, necesito datos semilla de roles (`ADMINISTRADOR`, `OPERADOR`) y su catálogo de permisos iniciales, para que el sistema sea usable desde el primer despliegue.

Tarea técnica de infraestructura, no historia de usuario funcional — se ejecuta como parte del script de datos iniciales (paralelo a `04_datos_iniciales.sql` de tu proyecto de referencia).

---

## 4. E2 — Gestión de Clientes y Vehículos

**HU-008** | Epic: E2 | Prioridad: Must
> Como Operador, quiero registrar un cliente con su documento de identidad, para tener un identificador único y confiable (corrige el hallazgo de nombres duplicados del Excel).

Criterios de aceptación:
- `documento_identidad` es obligatorio y único; si ya existe, se rechaza con error claro.
- Campos obligatorios: nombre completo, tipo y número de documento. Teléfono y dirección opcionales.
- Se genera auditoría (`ClienteRegistrado`).

Reglas de negocio: sección 5, hallazgo L de Fase 1. Dependencias: ninguna.

**HU-009** | Epic: E2 | Prioridad: Must
> Como Operador, quiero asociar uno o más vehículos a un cliente, para registrar su(s) mensualidad(es).

Criterios de aceptación:
- `placa` es obligatoria y única en el sistema.
- Un vehículo requiere `tipo_vehiculo` de un catálogo existente; `color` es opcional y separado del tipo (corrige hallazgo D de Fase 1).

Dependencias: HU-008.

**HU-010** | Epic: E2 | Prioridad: Should
> Como Operador, quiero cambiar el vehículo asociado a un cliente (o el cliente dueño de un vehículo), conservando el historial, para no perder trazabilidad cuando cambian de dueño.

Criterios de aceptación:
- El cambio cierra la fila vigente en `VehiculoClienteHistorial` (`fecha_fin`) y crea una nueva.
- Se genera auditoría.

Reglas de negocio: RN2, RN3.

**HU-011** | Epic: E2 | Prioridad: Must
> Como Operador, quiero consultar clientes y sus vehículos por nombre, documento o placa, para atender solicitudes rápidamente.

Criterios de aceptación:
- Resultado paginado (nunca listado completo sin límite).
- Búsqueda parcial por nombre, exacta por documento/placa.

---

## 5. E3 — Mensualidades y Cobranza

**HU-012** | Epic: E3 | Prioridad: Must
> Como Operador, quiero crear una mensualidad para un vehículo, tomando la tarifa vigente, para iniciar la relación de cobro mensual.

Criterios de aceptación:
- Se toma snapshot de `monto_mensual` desde `TarifaMensualidad` vigente al momento de crear (RN6).
- Un vehículo no puede tener dos mensualidades `ACTIVA` simultáneas (constraint de Fase 3).
- Estado inicial: `ACTIVA`.

Reglas de negocio: RN6. Dependencias: HU-009, tarifas configuradas (E5).

**HU-013** | Epic: E3 | Prioridad: Must
> Como sistema, necesito generar automáticamente el `Periodo` del mes correspondiente para cada mensualidad activa, para reemplazar la copia manual de hojas del Excel.

Criterios de aceptación:
- Se ejecuta una vez por mes (job programado — detalle en Fase 8/DevOps) o bajo demanda por el Administrador.
- No genera un periodo duplicado si ya existe para ese mes (`UNIQUE(mensualidad_id, anio_mes)`).
- El monto del periodo es un snapshot, no una referencia viva a la tarifa (RN6).

Reglas de negocio: RN6. Dependencias: HU-012.

**HU-014** | Epic: E3 | Prioridad: Must
> Como Operador, quiero registrar un pago (total, parcial, o que cubra varios periodos), para actualizar el estado de cuenta del cliente.

Criterios de aceptación (heredadas del diseño de Fase 5, caso `RegistrarPago`):
- El pago se distribuye entre los periodos indicados, del más antiguo al más reciente.
- El monto no puede exceder la suma de saldos pendientes de los periodos seleccionados (validación de negocio).
- El estado del periodo se recalcula automáticamente tras el pago, no se edita manualmente.
- Se genera auditoría (`PagoRegistrado`).

Reglas de negocio: RN5, RN10, RN11. Dependencias: HU-013.

**HU-015** | Epic: E3 | Prioridad: Must
> Como Administrador, quiero anular un pago registrado por error, conservando el registro original, para corregir errores sin perder trazabilidad.

Criterios de aceptación:
- El pago se marca `anulado = true` con `motivo_anulacion` obligatorio; nunca se borra (RN9).
- Los periodos afectados recalculan su estado automáticamente al excluir el pago anulado.
- Solo `PAGOS_ANULAR` (Administrador) puede ejecutar esta acción — Operador no puede (RN8).
- Se genera auditoría.

**HU-016** | Epic: E3 | Prioridad: Must
> Como Operador o Administrador, quiero consultar el estado de cuenta de un cliente/vehículo, para saber si está al día o en mora.

Criterios de aceptación:
- El estado (`AL_DIA`, `PENDIENTE`, `EN_MORA`, `PAGADO`) se calcula en el momento de la consulta, nunca se lee de una columna editable.
- Muestra el detalle por periodo con su saldo.

Reglas de negocio: RN11. Dependencias: HU-013, HU-014.

**HU-017** | Epic: E3 | Prioridad: Must
> Como Administrador, quiero consultar la lista de deudores (periodos vencidos con saldo pendiente), para gestionar cobranza.

Criterios de aceptación:
- Es una consulta derivada (no una tabla física "Deudores" — corrige hallazgo F de Fase 1).
- Filtrable por rango de fecha de vencimiento, tipo de vehículo, monto mínimo de deuda.

**HU-018** | Epic: E3 | Prioridad: Should
> Como Administrador, quiero suspender o cancelar una mensualidad, para reflejar que un cliente se retira o pausa temporalmente.

Criterios de aceptación:
- Transición de estado válida según Fase 2 (`ACTIVA↔SUSPENDIDA`, `→CANCELADA`).
- **`[DECISIÓN PENDIENTE 9]` sigue abierta:** qué ocurre con saldo pendiente al cancelar — esta historia queda con criterio de aceptación incompleto hasta resolverla. No se implementa hasta tener respuesta.

---

## 6. E4 — Parqueo Transitorio

**HU-019** | Epic: E4 | Prioridad: Must
> Como Operador, quiero registrar el ingreso de un vehículo (visitante o cliente mensual), para controlar quién está en el parqueadero.

Criterios de aceptación:
- Si no hay cupo disponible para el tipo de vehículo, se rechaza con error claro (`CUPO_NO_DISPONIBLE`).
- Si el vehículo corresponde a un cliente con mensualidad activa, se marca `es_cliente_mensual = true` y no se asocia tarifa de cobro.
- Operación transaccional con bloqueo pesimista sobre capacidad (Fase 5).
- Se genera auditoría.

Reglas de negocio: RN7, RN12. Dependencias: E5 (capacidad configurada).

**HU-020** | Epic: E4 | Prioridad: Must
> Como Operador, quiero registrar la salida de un vehículo, para calcular su cobro (si aplica) y liberar el cupo.

Criterios de aceptación:
- Si `es_cliente_mensual = true`, no se calcula cobro (acceso libre confirmado por la dueña).
- Si es visitante, se calcula el cobro con la estrategia vigente (`POR_DIA` o `POR_HORA`) y se registra el `Pago` asociado al `Movimiento`.
- El cupo se libera automáticamente (recalculado por consulta, no por contador editable — Fase 3).
- Se genera auditoría.

Reglas de negocio: RN12, RN13. Dependencias: HU-019.

**HU-021** | Epic: E4 | Prioridad: Should
> Como Administrador, quiero ver los vehículos que llevan más de X horas sin registrar salida, para detectar registros olvidados u omitidos.

Criterios de aceptación:
- Consulta sobre `Movimiento WHERE hora_salida IS NULL`, filtrable por umbral de tiempo.

**HU-022** | Epic: E4 | Prioridad: Should
> Como Administrador, quiero anular un movimiento registrado por error, conservando el registro original.

Criterios de aceptación: análogas a HU-015 (anulación lógica, nunca borrado — RN9).

---

## 7. E5 — Tarifas y Capacidad

**HU-023** | Epic: E5 | Prioridad: Must
> Como Administrador, quiero configurar la tarifa mensual por tipo de vehículo, para que las nuevas mensualidades usen el monto vigente.

Criterios de aceptación:
- Un cambio de tarifa no altera mensualidades/periodos ya generados (RN6, snapshot).
- No pueden existir dos tarifas vigentes solapadas para el mismo tipo de vehículo (constraint `EXCLUDE` de Fase 3).
- Solo `TARIFAS_CREATE`/`TARIFAS_UPDATE` (Administrador).

**HU-024** | Epic: E5 | Prioridad: Must
> Como Administrador, quiero configurar la tarifa de visitantes (modalidad día o por hora, monto, tope diario), para reflejar la política actual del negocio ($3.000 COP/día).

Criterios de aceptación:
- `ModalidadCobro` determina qué campos son obligatorios (`monto_dia` si es `POR_DIA`, `monto_hora`+`tope_maximo_diario` si es `POR_HORA`).
- Valor inicial de datos semilla: $3.000 COP, modalidad `POR_DIA`, tipo vehículo `MOTO`.

Reglas de negocio: RN12, RN13.

**HU-025** | Epic: E5 | Prioridad: Must
> Como Administrador, quiero configurar la capacidad total del parqueadero por tipo de vehículo, para controlar la ocupación.

Criterios de aceptación:
- Un valor por tipo de vehículo (`CapacidadParqueadero.capacidad_total`).
- No puede configurarse una capacidad menor a la ocupación actual (validación de negocio, evita estado inconsistente).

Dependencias: `[DECISIÓN PENDIENTE 8]` (cupos numerados vs. contador) — implementado bajo el supuesto de contador; si se confirma que hay cupos numerados, esta historia se reabre.

**HU-026** | Epic: E5 | Prioridad: Should
> Como Operador o Administrador, quiero consultar la ocupación actual por tipo de vehículo, para saber cuánto espacio disponible queda.

---

## 8. E6 — Dashboard y Reportes

**HU-027** | Epic: E6 | Prioridad: Must (MVP básico, según sección 26 del documento)
> Como Administrador, quiero un dashboard con: ingresos del mes, total de mensualidades activas, deudores actuales, ocupación actual, para tener visión general del negocio.

Criterios de aceptación:
- Todos los datos son proyecciones de solo lectura, recalculadas en consulta (no tablas propias — Fase 2).
- Carga en menos de X segundos con el volumen actual de datos (no crítico dado el tamaño real del negocio).

**HU-028** | Epic: E6 | Prioridad: Should
> Como Administrador, quiero generar un reporte financiero por rango de fechas (ingresos por mensualidades vs. por parqueo transitorio), para análisis periódico.

Reemplaza directamente a la hoja "Resumen Financiero" vacía del Excel original (hallazgo M de Fase 1).

**HU-029** | Epic: E6 | Prioridad: Could
> Como Administrador, quiero exportar reportes a PDF/Excel, para compartirlos fuera del sistema.

---

## 9. E7 — Auditoría (transversal, técnica)

**HU-030** | Epic: E7 | Prioridad: Must
> Como Administrador, quiero consultar el registro de auditoría filtrado por usuario, acción o rango de fecha, para investigar cualquier operación crítica.

Criterios de aceptación:
- Cubre como mínimo: login, pagos, ingresos/salidas, anulaciones, cambios de tarifa, cambios de capacidad, gestión de usuarios (RN10, sección 18 del documento original).
- La tabla `Auditoria` es append-only a nivel de permisos de base de datos (sin `UPDATE`/`DELETE` para el rol de aplicación).

**HU-031 (técnica)** | Epic: E7 | Prioridad: Must
> Como sistema, necesito que cada evento de dominio relevante dispare automáticamente un registro de auditoría, para que ningún desarrollador pueda omitirlo al agregar un caso de uso nuevo (Observer, ya justificado en Fase 5).

---

## 10. E8 — Notificaciones (Could, fuera del MVP)

**HU-032** | Epic: E8 | Prioridad: Could
> Como cliente, quiero recibir una notificación cuando mi mensualidad esté por vencer, para pagar a tiempo.

Nota: requiere canal de notificación (¿SMS, email, WhatsApp?) no definido en el documento de requerimientos. `[DECISIÓN PENDIENTE 15]` (nueva): ¿qué canal se espera? Queda fuera del MVP, no bloquea nada actual.

---

## 11. E9 — Backups y Recuperación (Should)

**HU-033** | Epic: E9 | Prioridad: Should
> Como Administrador, quiero que el sistema respalde la base de datos periódicamente, para poder recuperarme ante una falla.

Se detalla en Fase 8 (DevOps) — no es una historia de usuario con interfaz, es una tarea de infraestructura.

---

## 12. E10 — Migración del Excel (Must, una sola vez)

**HU-034 (técnica)** | Epic: E10 | Prioridad: Must
> Como equipo de implementación, necesito migrar los datos del Excel actual (clientes, vehículos, mensualidades, periodos, pagos) al nuevo sistema, aplicando la normalización definida en Fase 3, sección 6.

Criterios de aceptación:
- Todo registro migrado con datos ambiguos o incompletos (fechas inconsistentes, placas faltantes, estados no mapeables con certeza) se reporta en un log de "casos que requieren revisión manual", no se migra a ciegas con un valor supuesto.
- Ningún dato del Excel se descarta silenciosamente sin dejar rastro en el log de migración.

Dependencias: resolver `[DECISIÓN PENDIENTE 2]` antes de ejecutar (no antes de diseñarla).

---

## 13. Resumen de priorización MVP

**Must (MVP):** E1 completo, E2 completo, E3 (HU-012 a HU-017; HU-018 pausada por decisión pendiente 9), E4 completo, E5 (HU-023 a HU-025), E6 (solo HU-027), E7 completo, E10 completo.

**Should (post-MVP inmediato):** HU-003, HU-010, HU-021, HU-022, HU-026, HU-028, E9.

**Could (backlog futuro):** HU-029, E8.

---

## 14. Decisiones pendientes acumuladas que aún bloquean implementación de historias específicas

- `[DECISIÓN PENDIENTE 2]` — bloquea HU-034 (migración).
- `[DECISIÓN PENDIENTE 4]` — valores concretos de capacidad inicial para datos semilla de HU-025.
- `[DECISIÓN PENDIENTE 8]` — condiciona el alcance final de HU-025.
- `[DECISIÓN PENDIENTE 9]` — bloquea HU-018.
- `[DECISIÓN PENDIENTE 11]` — ya con supuesto aplicado en Fase 5, pendiente de tu confirmación final.
- `[DECISIÓN PENDIENTE 12]` — ¿el MVP incluye frontend propio? Afecta si agrego un Epic E11 "Interfaz Web" al backlog.
- `[DECISIÓN PENDIENTE 13]` — ya con recomendación aceptada tácitamente (solo por rol), doy por cerrada salvo objeción.
- `[DECISIÓN PENDIENTE 14]` — ya con recomendación aplicada en Fase 5 (in-process, sin outbox), doy por cerrada salvo objeción.
- `[DECISIÓN PENDIENTE 15]` (nueva) — canal de notificaciones, no bloquea el MVP.

---

