# Project Overview — YourParking Community Edition

> Última actualización: 2026-08-24 · Basado en commit `fd8253d` (working tree: `AGENTS.md` sin trackear, cambio de modo en `backend/mvnw`)

## Qué es

API REST de gestión de un parqueadero real (~15-30 clientes mensuales, motos) que reemplaza una planilla Excel. Alcance declarado: clientes y vehículos, mensualidades y cobranza, parqueo transitorio de visitantes, tarifas versionadas, control de capacidad, dashboard/reportes, usuarios con roles/permisos, auditoría, notificaciones y backups. `[DOCUMENTADO]` — docs/ETFv1 FASE 1.

## Estado general: pre-MVP, scaffolding transversal solamente

| Área | Estado |
|---|---|
| Especificación (docs/ETFv1, FASE 1–6) | Completa y aprobada `[CONFIRMADO]` — 8 documentos en `docs/ETFv1/` + versión consolidada en `docs/Especificación Técnica y Funcional/` |
| Código de negocio (controllers, casos de uso, entidades, repositorios) | **Inexistente** `[CONFIRMADO]` — no hay ninguna clase de dominio ni endpoint implementado |
| Infraestructura transversal | Parcial: seguridad JWT, config mail, Swagger, clase base de auditoría `[CONFIRMADO]` |
| Esquema de BD (`db/parking_management.sql`) | **Archivo vacío** `[CONFIRMADO]` — el modelo de datos de la FASE 3 no está materializado |
| Frontend (`frontend/`) | **Directorio vacío**, stack sin definir `[CONFIRMADO]` |
| CI/CD | Pipelines definidos; job de tests **fallando** en HEAD `[CONFIRMADO]` — ver [known-issues.md](known-issues.md) KI-01 |
| La aplicación arranca | **No** — el contexto Spring no carga por falta de bean `UserDetailsService` `[CONFIRMADO]` empíricamente — ver [known-issues.md](known-issues.md) KI-01 |

## Usuarios del sistema (espec)

`[DOCUMENTADO]` — ETFv1 FASE 2: **Administrador** (control total) y **Operador** (operación diaria sin permisos sobre tarifas/cupos/usuarios/eliminaciones). Los clientes mensuales y visitantes son sujetos de datos, no actores (sin portal de autoservicio en alcance MVP).

## Documentos relacionados

- [architecture.md](architecture.md) — arquitectura real vs. especificada
- [context-index.md](context-index.md) — índice maestro del contexto
