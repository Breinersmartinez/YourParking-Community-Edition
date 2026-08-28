# 🚀 Despliegue

Guía de contenedorización, CI/CD y variables de entorno de **YourParking**.

---

## Backend

### Dockerfile (multi-stage)

El `backend/Dockerfile` construye la imagen en dos etapas:

1. **Builder** (`eclipse-temurin:17-jdk`): compila el proyecto con `./mvnw clean package -DskipTests`.
2. **Runtime** (`eclipse-temurin:17-jre`): instala `curl` (para healthchecks), copia el `.jar` generado y lo ejecuta.

```bash
cd backend
docker build -t parking-management-api .
docker run -p 8080:8080 parking-management-api
```

> La imagen se construye con **contexto `./backend`**; asegúrate de ejecutar `docker build` desde `backend/` (o usar `-f backend/Dockerfile -f` con el contexto correcto, como hace el CI).

### Variables de entorno del backend

Definidas en el contenedor (ver `application.properties` y `docs/BACKEND.md`):

| Variable | Descripción |
| -------- | ----------- |
| `URL_DB` | URL JDBC de PostgreSQL. |
| `USER_NAME` | Usuario de la BD. |
| `PASSWORD_DB` | Contraseña de la BD. |
| `TOKEN_JWT` | Clave secreta para firmar JWT. |
| `USER_NAME_MAIL` / `APP_PASSWORD` | Credenciales SMTP (correo transaccional). |
| `ACCESS_TOKEN` | Token de Mercado Pago. |
| `PORT` | Puerto del servidor (default 8080). |

---

## Frontend

Build de producción y previsualización:

```bash
cd frontend
npm install
npm run build        # genera dist/
npm run preview      # sirve dist/ localmente
```

Variables del frontend (`frontend/.env`):

| Variable | Descripción |
| -------- | ----------- |
| `VITE_API_URL` | URL de la API backend (producción: apuntar al backend desplegado). |
| `VITE_API_BREINLOGIC_URL` | Endpoint del ChatBot (opcional). |

---

## Stack completo — Docker Compose + Makefile

En la raíz del repo hay un `docker-compose.yml` que levanta **todo el proyecto** en un solo comando:

| Servicio | Imagen / build | Puertos (default) |
| -------- | -------------- | ----------------- |
| `db` | `postgres:17-alpine` (inicializada con `db/parking_management.sql`) | `5432` |
| `backend` | `backend/Dockerfile` (Spring Boot, Java 17) | `8080` |
| `frontend` | `frontend/Dockerfile` (React + Vite servido con Nginx) | `3000` |
| `prometheus` | `prom/prometheus` | `9090` |
| `grafana` | `grafana/grafana` | `3001` (admin/admin) |

**Integración con Make:** el `Makefile` automatiza el ciclo de vida de los contenedores.

```bash
make help            # lista todos los comandos
make up              # levanta el stack completo
make up SVC=backend  # levanta solo un servicio
make build           # construye las imágenes
make logs SVC=db     # logs en vivo de un servicio
make restart         # reinicia los contenedores
make ps              # estado de los contenedores
make down            # detiene (conserva volúmenes)
make clean           # detiene y borra volúmenes (¡pierde datos!)
make db-shell        # abre psql en el contenedor de la BD

# Stack de métricas standalone (backend corriendo fuera de contenedores)
make up-metrics      # solo Prometheus + Grafana
```

**Configuración (`docker-compose.yml`):**

- Por defecto el stack usa la **PostgreSQL local** del compose (`parking`/`parking123`, BD `parking_management`).
- Para apuntar a una BD externa (p. ej. Neon) o definir credenciales reales, copia `.env.example` a `.env` en la raíz del repo y ajusta `URL_DB`, `USER_NAME`, `PASSWORD_DB`, `TOKEN_JWT`, etc.
- El frontend se construye con `VITE_API_URL` (default `http://localhost:8080`); lo cambia la variable `VITE_API_URL` del `.env` raíz.
- Prometheus (config para el stack en red: `metrics/prometheus/prometheus.compose.yml`) hace scraping de `backend:8080/actuator/prometheus`.

---

## CI/CD — GitHub Actions

Pipelines bajo `.github/workflows/` (puertas obligatorias en ramas estables):

| Workflow | Propósito |
| -------- | --------- |
| `ci.yml` | **CI:** compila y testea backend (Maven + JaCoCo) y frontend (lint + build) en PRs y pushes. Job `required` como status check único. |
| `docker-image.yml` | **CD de imágenes:** build de `backend`/`frontend` (matrix) con Docker Buildx, etiquetas automáticas (sha/develop/latest/semver), **SBOM + SLSA provenance**, escaneo **Trivy** y firma **cosign keyless (OIDC)**. Publica en GHCR. |
| `codeql.yml` | Análisis estático **CodeQL** (Java + JavaScript), con consultas *security-and-quality*, en PRs y semanal. |
| `security.yml` | **Dependency Review** (bloquea PRs con vulns altas) y escaneo **Trivy** del repositorio (semanal). |
| `deploy.yml` | **CD de despliegue:** orquesta entornos protegidos `dev`/`staging`/`prod` (`deploy-stack.yml` reutilizable, SSH + docker compose contra imágenes de GHCR). |
| `pr-hygiene.yml` | **Controles de PR:** título con **Conventional Commits** y etiquetado automático por rutas (`labeler.yml`). |
| `dependabot.yml` | Actualizaciones automáticas de dependencias (Maven, npm, GitHub Actions, Docker). |

### Disparadores principales

- **PR / push a `main`/`develop`** → `ci.yml`, y `docker-image.yml` en PR construye solo para verificar (sin publicar).
- **push a `main`** → imagen `latest` en GHCR.
- **push a `develop`** → imagen `develop` y despliegue al entorno `dev`.
- **tag `v*`** → imágenes semver (p. ej. `v1.2.3`) + despliegue a `prod`.
- **semanal** → CodeQL y Trivy (seguridad continua).
- **`workflow_dispatch`** → ejecución manual (build, deploy a dev/staging/prod).

### Seguridad del pipeline

- Actions **pineadas a SHA** completos (inmutabilidad/supply-chain).
- Permisos por workflow con **mínimo privilegio** (`contents: read`, etc.).
- `concurrency` para cancelar ejecuciones obsoletas en la misma rama.
- Firma de imágenes con **cosign keyless** vía OIDC (`id-token: write`).
- Reglas de protección de rama recomendadas: `ci` (job `required`), CodeQL, Dependency Review y PR con título semántico como checks obligatorios.

### Despliegue por entornos

El flujo de despliegue (SSH) espera estos secretos (repo o por entorno):

`DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PORT`, `DEPLOY_GHCR_USER`, `DEPLOY_GHCR_PAT` y opcionalmente `URL_DB`, `USER_NAME`, `PASSWORD_DB`, `TOKEN_JWT`, `USER_NAME_MAIL`, `APP_PASSWORD`, `ACCESS_TOKEN`.

En el servidor se suben `docker-compose.yml` + `docker-compose.prod.yml` (que hace pull de las imágenes GHCR) y un `.env` generado desde los secretos. Luego ejecuta `docker compose ... up -d --no-build`.

---

## Puesta en producción (resumen)

1. Desplegar el **backend** en cualquier proveedor compatible con Docker (Render, Railway, Fly.io, un VPS, etc.) pasando las variables de entorno.
2. Crear/actualizar la base **PostgreSQL** y apuntar `URL_DB`.
3. Construir y servir el **frontend** como estático (Vercel, Netlify, GitHub Pages, S3 + CDN).
4. Configurar `VITE_API_URL` del frontend apuntando al dominio del backend y habilitar el **CORS** del backend para ese dominio.

---

## Buenas prácticas de seguridad

- **Nunca** commitear credenciales reales (`.env`, `parking-management-api.env`, tokens). Están ignorados por `.gitignore`.
- Rotar contraseñas/tokens si alguna vez se exponen en un commit o log.
- En producción, usar secretos del proveedor (variables de entorno cifradas) y **no** versionar archivos `.env`.
- Usar HTTPS en producción.
