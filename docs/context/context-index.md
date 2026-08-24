# Context Index — punto de entrada para agentes

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

Cómo usar: para cualquier cambio en el repo, lee primero los documentos de prioridad ALTA que apliquen a tu tarea. Si encuentras contradicción entre este contexto y el código, **el código gana** y se actualiza el contexto (ver [changelog-context.md](changelog-context.md)).

| Documento | Contiene | Cuándo consultarlo | Relacionado con | Prioridad |
|---|---|---|---|---|
| [project-overview.md](project-overview.md) | Qué es el proyecto, alcance, estado real por área | Al iniciar cualquier sesión | todos | **ALTA** |
| [known-issues.md](known-issues.md) | Bloqueantes, bugs, discrepancias doc↔código, incertidumbres | Antes de tocar cualquier cosa; KI-01 bloquea el arranque | security, api | **ALTA** |
| [architecture.md](architecture.md) | Arquitectura especificada vs. implementada, reglas estructurales | Antes de crear módulos/paquetes nuevos | modules, decisions | **ALTA** |
| [development-guide.md](development-guide.md) | Cómo levantar, verificar y reglas vinculantes del repo | Antes de correr/build/commit | infrastructure, conventions | **ALTA** |
| [domain.md](domain.md) | Agregados, servicios de dominio, eventos, estados (espec) | Antes de implementar cualquier módulo de negocio | business-rules, database | **ALTA** si tocas dominio |
| [business-rules.md](business-rules.md) | RN1–RN13 + supuestos pendientes del negocio | Antes de implementar reglas o validaciones | domain | ALTA si tocas dominio |
| [database.md](database.md) | Estado real del esquema + modelo relacional previsto + constraints | Antes de agregar entidades/migraciones | domain, decisions | MEDIA |
| [security.md](security.md) | JWT/CORS/rutas reales + RBAC especificado + secretos | Antes de tocar endpoints o seguridad | known-issues KI-01..07 | MEDIA |
| [api.md](api.md) | Superficie HTTP real (casi nula) + convenciones REST acordadas | Antes de crear controllers/DTOs | security, domain | MEDIA |
| [modules.md](modules.md) | Inventario de paquetes existentes y previstos | Antes de crear clases nuevas | architecture | MEDIA |
| [infrastructure.md](infrastructure.md) | Compose, Dockerfile, CI/CD, monitoreo | Antes de tocar pipelines/docker | development-guide | MEDIA |
| [integrations.md](integrations.md) | Mercado Pago, SMTP, monitoreo; variables externas | Antes de usar SDKs externos/env vars | infrastructure | BAJA |
| [testing.md](testing.md) | Estado de tests, JaCoCo, cómo corre CI | Antes de escribir tests | development-guide | BAJA |
| [conventions.md](conventions.md) | Estilo observado y prescrito; antipatrones a evitar | Al escribir código nuevo | known-issues | MEDIA |
| [decisions.md](decisions.md) | ADRs D1–D13 + pendientes del negocio + recomendaciones | Antes de proponer cambios de diseño | architecture, business-rules | MEDIA |
| [changelog-context.md](changelog-context.md) | Historial de mantenimiento del propio contexto | Al actualizar este contexto | todos | BAJA |

Regla de coherencia: `context-index.md` debe listar exactamente los archivos presentes en esta carpeta. Si agregas/mueves un documento, actualiza esta tabla y su fecha.
