# Changelog del contexto

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

Registro de actualizaciones de `docs/context/`. Formato: fecha · commit base · qué cambió y por qué.

---

## 2026-08-24 · commit `fd8253d` — Creación inicial

Generación completa del contexto (18 documentos) a partir de un análisis exhaustivo del repositorio:

- **Explorado**: código fuente backend completo (9 clases Java), `pom.xml`, `application.properties`, `docker-compose.yml`, `backend/Dockerfile`, 3 workflows de GitHub Actions, configs de Prometheus/Grafana, `db/parking_management.sql`, `.env.example`/`.gitignore`/`.yamllint`, docs ETFv1 completos (FASE 1–6 + 2 actualizaciones + espec consolidada), README, AGENTS.md.
- **Verificaciones empíricas**: compilación Maven OK; test de contexto FALLA por falta de bean `UserDetailsService` (KI-01); estado real de GitHub Actions consultado (CI failure en develop).
- **No leído deliberadamente**: `backend/.env` real (regla: no usar `.env` como fuente; solo su existencia queda registrada).

Documentos creados: README.md, context-index.md, project-overview.md, architecture.md, modules.md, domain.md, business-rules.md, api.md, database.md, security.md, testing.md, infrastructure.md, development-guide.md, conventions.md, integrations.md, decisions.md, known-issues.md, changelog-context.md.

## Estrategia de actualización incremental (para futuras ejecuciones)

1. **Detectar cambios**: comparar HEAD contra el commit base anotado arriba/en cada documento (`git log <base>..HEAD --oneline`, `git diff --stat`). Si no hay git, comparar timestamps/contenido.
2. **Mapear impacto** usando la tabla de [context-index.md](context-index.md):
   - Cambios bajo `backend/src/**/shared/security|documentation|audit`, `notification/` → security.md, modules.md, api.md
   - Nuevos módulos/paquetes de negocio → modules.md, architecture.md, domain.md (si materializa espec)
   - Cambios en `pom.xml` → project-overview (stack), integrations.md, database.md (si migraciones)
   - Cambios en `db/*.sql`, JPA/Flyway → database.md
   - Cambios en `docker-compose*`, `Dockerfile`, `.github/`, `docker/` → infrastructure.md, development-guide.md
   - Cambios en `.env.example`/properties → integrations.md, security.md
   - Cambios en `docs/ETFv1/**` o README → known-issues.md, decisions.md, domain/business-rules
   - Tests nuevos/cambiados → testing.md
3. **Actualizar solo lo afectado**; eliminar lo obsoleto marcándolo con fecha de remoción si conviene trazabilidad.
4. **Registrar** aquí: documentos tocados, motivo, commit base nuevo.
5. **Revalidar** solo los documentos tocados y sus enlaces directos.
6. **Conflictos código-contexto**: el código gana; dejar constancia en known-issues.md o decisions.md.

## Checklist de validación (aplicar tras cada actualización)

- [ ] Cada documento mantiene metadatos (fecha + commit) y etiquetas de estado donde corresponde.
- [ ] Sin enlaces internos rotos; `context-index.md` lista exactamente los archivos existentes.
- [ ] Ningún `[CONFIRMADO]` sin referencia rastreable a archivo/evidencia.
- [ ] Ningún secreto/token/contraseña copiado.
- [ ] `[RECOMENDACIÓN]` separadas de hechos.
