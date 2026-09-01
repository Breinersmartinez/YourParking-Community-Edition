# YourParking — Community Edition 

Sistema de gestión de parqueaderos de código abierto. Incluye una **API REST** (Spring Boot) y una **aplicación web** (React + Vite) con una interfaz de administración completa y un portal para clientes.

<a href="#">
  <img alt="Spring Boot" src="https://img.shields.io/badge/Spring%20Boot-3.4.3-6DB33F?logo=spring&logoColor=white" />
  <img alt="Java" src="https://img.shields.io/badge/Java-17-007396?logo=openjdk&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql&logoColor=white" />
</a>

---

##  Características

- **Autenticación y roles**: Spring Security + JWT con roles (`ADMIN`, `OPERATOR`, `SUPERVISOR`, `VIGILANTE`, `USER`). Contraseñas cifradas con BCrypt.
- **Gestión del parqueadero**: niveles, zonas, espacios, vehículos, tickets de entrada/salida, reservas e incidentes.
- **Facturación y tarifas**: precios configurables por tipo de vehículo y período, con cálculo automático.
- **Pagos**: seguimiento con varios métodos e integración con **Mercado Pago**.
- **Panel de administración**: dashboard con estadísticas en tiempo real y CRUD completo de todas las entidades.
- **Portal del cliente**: vehículos, reservas y suscripciones.
- **Asistente virtual**: ChatBot integrado (requiere `breinLogicUrl`).
- **Documentación**: Swagger UI automática y API REST completa.

---

##  Estructura del monorepo

```
.
├── backend/       # API Spring Boot (Java 17, Maven)
├── frontend/      # SPA React + Vite + Tailwind CSS
├── db/            # Scripts SQL de la base de datos
├── docs/          # Documentación del proyecto
└── .github/       # CI/CD (GitHub Actions)
```

---

##  Documentación

Toda la documentación está en [`docs/`](./docs/README.md):

| Documento | Contenido |
| --------- | --------- |
| [ARQUITECTURA.md](./docs/ARQUITECTURA.md) | Stack, componentes y flujo de autenticación. |
| [API.md](./docs/API.md) | Referencia completa de endpoints REST. |
| [BACKEND.md](./docs/BACKEND.md) | Estructura, seguridad y modelo de datos del backend. |
| [FRONTEND.md](./docs/FRONTEND.md) | Rutas, estructura y sistema de diseño del frontend. |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Docker, CI/CD y variables de entorno. |
| [DICCIONARIO_DATOS.md](./docs/DICCIONARIO_DATOS.md) | Diccionario de datos de la base de datos. |
| [METRICAS.md](./docs/METRICAS.md) | Observabilidad con Prometheus y Grafana. |
| [Requeriments.md](./docs/Requeriments.md) | Requerimientos funcionales y modelo de datos. |

---

##  Inicio rápido

### Requisitos previos

- **Backend**: Java 17+, Maven 3.6+ (o `./mvnw`), PostgreSQL.
- **Frontend**: Node 18+, npm.

### Backend

```bash
cd backend
# Configura las variables de entorno (ver docs/DEPLOYMENT.md)
./mvnw spring-boot:run
```

- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend

```bash
cd frontend
npm install
npm start
```

- App: `http://localhost:4200` (dev server de Angular; consume la API vía `apiUrl`)

---

##  Variables de entorno

### Backend (`docs/BACKEND.md`)

| Variable | Descripción |
| -------- | ----------- |
| `URL_DB` | URL JDBC de PostgreSQL |
| `USER_NAME` | Usuario de la base de datos |
| `PASSWORD_DB` | Contraseña de la base de datos |
| `TOKEN_JWT` | Clave secreta para firmar JWT |
| `USER_NAME_MAIL` / `APP_PASSWORD` | Credenciales SMTP (correo) |
| `ACCESS_TOKEN` | Token de Mercado Pago |
| `PORT` | Puerto HTTP (default 8080) |

### Frontend (`docs/FRONTEND.md`)

| Variable | Descripción |
| -------- | ----------- |
| `API_URL` | Build-arg del frontend en Docker: URL base de la API (`http://localhost:8080` en local) |
| `breinLogicUrl` | Endpoint del ChatBot (opcional) |

>  **Seguridad:** las credenciales reales viven en archivos `.env` **ignorados por git**. Nunca las subas al repositorio; si se filtran, rótalas.

---

##  Docker

```bash
cd backend
docker build -t parking-management-api .
docker run -p 8080:8080 parking-management-api
```

El CI [`.github/workflows/docker-image.yml`](./.github/workflows/docker-image.yml) construye y publica la imagen en **GHCR** automáticamente (contexto `./backend`).

---

##  Tecnologías

**Backend:** Spring Boot 3.4.3 · Spring Security + JWT · Spring Data JPA · PostgreSQL · SpringDoc OpenAPI · Lombok · Mercado Pago SDK · JavaMail.

**Frontend:** React 18 · Vite 5 · React Router DOM 7 · Tailwind CSS 3 · Axios · Lucide React.

---

##  Autor

**Breiner Martínez**

- GitHub: [@Breynersmartinez](https://github.com/Breynersmartinez)
- Portfolio: https://my-portfolio-tau-green-52.vercel.app

---

##  Licencia

MIT License.
