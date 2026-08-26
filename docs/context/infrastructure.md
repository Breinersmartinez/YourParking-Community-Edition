# Infrastructure — Docker, CI/CD, monitoreo

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

## Stack local completo (`docker-compose.yml`) — `[CONFIRMADO]`

Proyecto Compose: `yourparking`. Red bridge `app-net`.

| Servicio | Imagen | Puerto | Notas |
|---|---|---|---|
| `db` | postgres:16-alpine | 5432 | monta `db/parking_management.sql` como init (vacío hoy); healthcheck `pg_isready` |
| `backend` | build `backend/Dockerfile` | 8080 | espera health de db; healthcheck propio vía `/actuator/health`; `JAVA_OPTS=-XX:MaxRAMPercentage=75.0` |
| `prometheus` | prom/prometheus:v3.4.1 | 9090 | scrapea backend cada 10 s; retención 15 d |
| `graphite` | graphiteapp/graphite-statsd:1.1.10-14.2 | 8282→80, 2003, 2004, 8125, 8126 | almacén TSDB + UI |
| `grafana` | grafana/grafana:11.6.1 | 3000 | provisioning automático de datasources Prometheus + Graphite (`docker/grafana/provisioning/`) |

Variables requeridas por Compose (solo nombres): `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `TOKEN_JWT`, `USER_NAME_MAIL`, `APP_PASSWORD`, `ACCESS_TOKEN`, `GRAFANA_ADMIN_USER/PASSWORD`. Referencia: `.env.example`.

## Imagen backend (`backend/Dockerfile`) — `[CONFIRMADO]`

Multi-stage: build con `eclipse-temurin:23-jdk` + `./mvnw clean package -DskipTests`; runtime `eclipse-temurin:23-jre`, jar expuesto en 8080. **Inconsistencia**: el proyecto declara Java 17 (pom, CI) pero el Dockerfile usa JDK/JRE 23 (KI-09).

## CI/CD (GitHub Actions) — `[CONFIRMADO]`

| Workflow | Trigger | Jobs |
|---|---|---|
| `ci.yml` | push a `main/develop*/feature/**`; PR a `main/develop*` | `test`: Postgres service + `mvnw verify` con env dummy + artefacto JaCoCo · `lint`: yamllint + `docker compose config --quiet` |
| `codeql.yml` | push `main/develop*`, PR main, semanal | análisis CodeQL Java (`security-extended`) tras compilar |
| `docker-image.yml` | push/PR a `main` | build Buildx (cache GHA) → escaneo Trivy (falla con CRITICAL/HIGH sin fix) → push a GHCR tags `latest` + `sha` |

**Estado actual**: job `test` de CI FALLA en HEAD (KI-01); CodeQL pasa. `[CONFIRMADO]` vía GitHub Actions.

## Monitoreo — `[CONFIRMADO]`

Actuator expone `health,info,metrics,prometheus`; histogramas habilitados para latencias HTTP; tag `application=parking-management-api`. Prometheus scrapea `backend:8080/actuator/prometheus` (10 s) y se auto-scrapea; intenta scrapear `graphite:8080` (puerto posiblemente erróneo, KI-10). Grafana con ambos datasources provisionados.

## Despliegue real conocido — `[DOCUMENTADO]`

README menciona una demo en Render (`parking-management-api-k4ih.onrender.com`) heredada del proyecto original; no hay manifiestos de despliegue en el repo.

## Referencias

- [development-guide.md](development-guide.md) — cómo levantar el stack
- [known-issues.md](known-issues.md) — KI-01..KI-10
