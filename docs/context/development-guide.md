# Development Guide — cómo trabajar en este repo

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

## Levantar todo (recomendado)

```bash
cp .env.example .env   # completar valores
docker compose up -d --build
```
Backend :8080 · Swagger `/swagger-ui.html` · Grafana :3000 · Prometheus :9090 · Graphite UI :8282.

## Backend local

Exportar `URL_DB`, `USER_NAME`, `PASSWORD_DB`, `TOKEN_JWT`, `USER_NAME_MAIL`, `APP_PASSWORD`, `ACCESS_TOKEN` (apuntando a un Postgres 16) y:

```bash
cd backend && ./mvnw spring-boot:run
```

`application.properties` no tiene defaults: sin esas variables falla. `[CONFIRMADO]`

**ADVERTENCIA (KI-01): con el código actual la aplicación no arranca** — falta bean `UserDetailsService`. Cualquier sesión de desarrollo debe empezar por resolver eso o esperar que ya esté resuelto.

## Verificación como CI

```bash
cd backend && ./mvnw -B -ntp verify   # requiere Postgres arriba + variables exportadas
```

Compilación rápida sin BD: `./mvnw -B -ntp compile` (verificado OK en HEAD). El test de contexto sí requiere resolver KI-01.

## Flujo de trabajo y convenciones de repo

- Ramas: `main`, `develop*` (existe `develop`), `feature/**`. PRs hacia develop/main; CI obligatorio.
- Commits en español con prefijo de módulos afectados, ej.: `ci+docs:`, `infra+backend:`, `docs+backend:`. `[CONFIRMADO]` por historial git
- YAML debe pasar `.yamllint` (config en raíz) y `docker compose config --quiet`.
- Español para comentarios, docs y mensajes.

## Reglas del proyecto (de AGENTS.md, vinculantes)

1. Módulos = un directorio por bounded context bajo `com.example.parking_management/`, nombres singulares en inglés (`user`, `vehicle`, `payment`); lo transversal en `shared/`.
2. Estructura interna por módulo: `in → application → domain → out`; reglas de negocio SOLO en `domain`; `@Transactional` al borde de `application`; entidades JPA nunca compartidas entre módulos.
3. Un controller por módulo, prefijo `/api/<módulo>`; solo traduce HTTP↔caso de uso.
4. Configuración exclusivamente por variables de entorno con los nombres exactos de `application.properties`; cero secretos hardcodeados.
5. No usar README.md como fuente de configuración (está desactualizado — ver known-issues).
6. No tocar `db/parking_management.sql` salvo para cambiar el modelo de datos; tras editarlo recrear volumen (`docker compose down -v`).
7. Sin lógica de negocio en controllers/repositories; sin microservicios ni infra nueva (decisión cerrada ETFv1 FASE 4).
8. No trabajar sobre `frontend/` (vacío, stack sin definir).
9. No copiar más archivos `.rest` dentro de `src/main/java`.

## Referencias

- [conventions.md](conventions.md) — estilo de código observado
- [testing.md](testing.md) — estrategia de pruebas
