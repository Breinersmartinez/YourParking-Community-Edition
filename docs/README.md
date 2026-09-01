# 📚 Documentación del Proyecto — YourParking

Sistema de gestión de parqueaderos de código abierto que consta de dos partes:

- **`backend/`** — API REST con **Spring Boot 3.4.3** (Java 17, Spring Security + JWT, Spring Data JPA, PostgreSQL).
- **`frontend/`** — aplicación web **Angular 19** con Tailwind CSS, estilizada con la paleta corporativa de parqueadero (naranja, negro, grises y amarillo).

Este índice reúne toda la documentación técnica del proyecto.

---

## Índice de documentación

| Documento | Descripción |
| --------- | ----------- |
| [ARQUITECTURA.md](./ARQUITECTURA.md) | Visión general del monorepo: componentes, stack tecnológico y diagrama de arquitectura. |
| [API.md](./API.md) | Referencia completa de los endpoints REST del backend. |
| [BACKEND.md](./BACKEND.md) | Estructura del backend, seguridad, autenticación y modelo de datos. |
| [FRONTEND.md](./FRONTEND.md) | Estructura del frontend, sistema de rutas, diseño de UI y servicios. |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Despliegue: Docker, CI/CD (GitHub Actions), variables de entorno. |
| [DICCIONARIO_DATOS.md](./DICCIONARIO_DATOS.md) | Diccionario de datos de la BD: tablas, columnas, tipos y relaciones. |
| [METRICAS.md](./METRICAS.md) | Observabilidad: Actuator, Prometheus y Grafana, métricas clave y alertas. |
| [Requeriments.md](./Requeriments.md) | Documento de requerimientos funcionales y diseño del modelo de datos. |
| [HELP.md](./HELP.md) | Referencia autogenerada de Spring Initializr / plugins (legado). |

---

## Inicio rápido

### 1. Backend

```bash
cd backend
# Configurar variables de entorno (ver DEPLOYMENT.md)
cp .env.example .env   # si existe; en su defecto exportar las variables
./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:8080` y la documentación Swagger en `http://localhost:8080/swagger-ui.html`.

> **Nota de seguridad:** el backend espera variables de entorno como `URL_DB`, `USER_NAME`, `PASSWORD_DB`, `TOKEN_JWT`, etc. **Nunca** commitees credenciales reales; usa un archivo `.env` ignorado por git (ver `.gitignore`).

> **Base de datos:** el esquema de referencia (PostgreSQL) está en [`db/parking_management.sql`](../db/parking_management.sql). El diccionario de datos detallado está en [DICCIONARIO_DATOS.md](./DICCIONARIO_DATOS.md).

### 2. Frontend

```bash
cd frontend
npm install
npm start         # servidor de desarrollo (Angular, puerto 4200)
```

La app abre en `http://localhost:4200` y consume la API en `http://localhost:8080` (configurable vía `environment.apiUrl` / build-arg `API_URL`).

---

## Rutas principales de la aplicación

| Ruta | Tipo | Descripción |
| ---- | ---- | ----------- |
| `/` | Pública | Landing page (navbar, hero, features, pricing, testimonials, footer). |
| `/login` | Pública | Inicio de sesión único para staff y clientes. |
| `/clientSignUp` | Pública | Registro de clientes. |
| `/portal` | Cliente (autenticado) | Dashboard del cliente: vehículos, reservas y suscripciones. |
| `/admin` | Admin (autenticado) | Panel de administración con 10 secciones de gestión. |
| `/portal/chatbot` | Cliente (autenticado) | Asistente virtual (depende de `breinLogicUrl`). |

Consulta [FRONTEND.md](./FRONTEND.md) para el detalle de rutas y [API.md](./API.md) para los endpoints, si deseas contribuir.
