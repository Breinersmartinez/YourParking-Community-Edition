# Decisions — registro de decisiones (estilo ADR)

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

Formato compacto: Decisión / Estado / Fuente. Las D1–D9 provienen de la espec ETFv1 (estado: aceptadas según el propio documento); D10+ se extraen del código real.

| ID | Decisión | Estado | Fuente |
|---|---|---|---|
| D1 | Monolito modular + Hexagonal; Clean Architecture como criterio interno por módulo | Aceptada `[DOCUMENTADO]` | ETFv1 FASE 4 §1 |
| D2 | Descarte explícito de microservicios, colas externas, Redis, GraphQL/gRPC para este alcance (~15-30 clientes, 1 sede); revisable si el negocio crece | Aceptada `[DOCUMENTADO]` | ETFv1 FASE 4 §1/§8 |
| D3 | PostgreSQL como motor (por `EXCLUDE USING gist`, constraints parciales, costo cero) | Aceptada `[DOCUMENTADO]` | ETFv1 FASE 3 §8 |
| D4 | RBAC con tablas Rol/Permiso N:M y autorización por permisos (`RECURSO_ACCION`, `@PreAuthorize hasAuthority`), adoptado del proyecto "Medical Management" | Aceptada `[DOCUMENTADO]` — el código actual aún usa roles con `hasRole` (KI-07) | Actualización Roles y Permisos |
| D5 | Estado del Periodo derivado en consulta, nunca persistido editable; "Deudores" es consulta, no tabla | Aceptada `[DOCUMENTADO]` | ETFv1 FASE 2 §6, RN4/RN11 |
| D6 | Cupo = contador de capacidad por tipo de vehículo (`CAPACIDAD_PARQUEADERO`), no cupos físicos numerados; ocupación calculada, no almacenada | Aceptada bajo supuesto `[DOCUMENTADO]` | ETFv1 FASE 2 §4, FASE 3 §2 |
| D7 | Ingreso/Salida = una sola entidad `Movimiento` con `hora_salida` nullable; clientes mensuales SÍ generan movimiento sin cobro | Resuelta `[DOCUMENTADO]` | ETFv1 FASE 3 §0 (DP7, DP10) |
| D8 | Eventos de dominio in-process (Spring events), sin outbox para MVP | Recomendación aplicada `[DOCUMENTADO]` | ETFv1 FASE 5 §8 (DP14) |
| D9 | Bloqueo pesimista `SELECT ... FOR UPDATE` para asignación de cupos | Recomendación `[DOCUMENTADO]` | ETFv1 FASE 5 §5 |
| D10 | Configuración 100% por variables de entorno sin defaults; nombres fijados por `application.properties` | Activa `[CONFIRMADO]` | application.properties + AGENTS.md |
| D11 | Seguridad base: JWT HS256 (24 h), BCrypt, stateless, CSRF off, filtro antes de UsernamePasswordAuthenticationFilter | Activa `[CONFIRMADO]` | SecurityConfig/JwtService |
| D12 | Stack de monitoreo self-hosted Prometheus + Grafana + Graphite vía Compose | Activa `[CONFIRMADO]` | docker-compose.yml |
| D13 | CI obligatorio (tests + lint YAML/compose) + CodeQL + publicación GHCR con escaneo Trivy | Activa `[CONFIRMADO]` | .github/workflows/* |

## Decisiones pendientes del negocio (no técnicas) — `[DOCUMENTADO]`

DP2 (significado fechas Excel), DP4 (valores de capacidad/vencimiento), DP8 (confirmar cupos), DP9 (retiro con saldo), DP11 (24 h vs calendario), DP12 (¿frontend propio?), DP15 (canal de notificaciones). Detalle: ETFv1 FASE 6 §14.

## `[RECOMENDACIÓN]` (no forman parte del sistema actual)

- Introducir Flyway como herramienta de migraciones cuando se materialice el esquema (FASE 4 lo exige; hoy no existe ninguna).
- Al implementar login, alinear `SecurityConfig` con el modelo Rol/Permiso de D4 y eliminar la exclusión de `SecurityAutoConfiguration`.
