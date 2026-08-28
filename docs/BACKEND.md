# ⚙️ Backend — Spring Boot

API REST de **YourParking** construida con **Spring Boot 3.4.3** (Java 17), empaquetada con Maven y localizada en la carpeta `backend/`.

---

## Estructura del paquete

```
src/main/java/com/example/parking_management/
├── ParkingManagementApplication.java   # Clase de arranque
├── audit/Auditable.java                # Entidad base auditable
├── config/
│   ├── SecurityConfig.java             # Configuración de seguridad + CORS
│   ├── MailConfig.java                 # Configuración de JavaMail (SMTP)
│   └── documentationConfig/SwaggerOpenApiConfig.java
├── controller/                         # Controladores REST
│   ├── AuthController.java
│   ├── UserController.java
│   ├── VehicleController.java
│   ├── SpaceController.java
│   ├── LevelController.java
│   ├── ZoneController.java
│   ├── TicketController.java
│   ├── ReservationController.java
│   ├── PaymentController.java
│   ├── RateController.java
│   ├── SubscriptionController.java
│   ├── IncidentController.java
│   └── MercadoPago.java                # Webhook/integración Mercado Pago
├── dto/                                # Objetos de transferencia (Request/Response)
├── jwt/
│   ├── JwtAuthenticationFilter.java    # Filtro que valida el token por petición
│   └── JwtService.java                 # Generación/validación de JWT
├── model/                              # Entidades JPA + enums
├── repository/                         # Repositorios Spring Data JPA
└── service/                            # Lógica de negocio
```

---

## Seguridad y autenticación

- **Autenticación**: `POST /api/auth/login` devuelve un JWT firmado con la clave `TOKEN_JWT`.
- **Filtro JWT**: `JwtAuthenticationFilter` intercepta cada petición, lee la cabecera `Authorization: Bearer <token>`, lo valida y carga el usuario vía `CustomUserDetailsService`.
- **Roles**: `Role` enum → `ADMIN`, `OPERATOR`, `SUPERVISOR`, `VIGILANTE`, `USER`.
- **Contraseñas**: se almacenan y validan cifradas con **BCrypt**.
- **CORS**: `SecurityConfig` permite los orígenes de las aplicaciones frontend (local y producción) y los métodos `GET, POST, PUT, PATCH, DELETE, OPTIONS`, exponiendo la cabecera `Authorization`.

> Los roles y permisos concretos por endpoint se gestionan en `SecurityConfig.java`.

---

## Modelo de datos

Entidades principales (paquete `model/`):

| Entidad | Descripción |
| ------- | ----------- |
| `User` | Usuario (cliente o staff) con rol y tipo de identificación. |
| `Vehicle` | Vehículo asociado a un usuario (por placa). |
| `Level` | Piso del parqueadero. |
| `Zone` | Zona/sector dentro de un nivel. |
| `Space` | Espacio de parqueo (nivel + zona + estado + tipo). |
| `Ticket` | Registro de entrada/salida de un vehículo. |
| `Reservation` | Reserva de un espacio por un usuario. |
| `Payment` | Pago asociado a un ticket. |
| `Rate` | Tarifa configurable por tipo de vehículo y período. |
| `Subscription` | Abono o mensualidad de un usuario. |
| `Incident` | Incidente reportado (daño, robo, accidente, otro). |

### Enums centrales

`Role`, `IdentificationType`, `SpaceState`, `SpaceType`, `TicketState`, `ReservationState`, `PaymentState`, `PaymentMethod`, `SubscriptionState`, `SubscriptionType`, `IncidentState`, `IncidentType`, `VehicleType`.

Los mismos valores se replican en el frontend (`services/index.js` → `ENUMS`).

---

## Configuración (`application.properties`)

El backend se configura mediante **variables de entorno** (para no exponer credenciales en el repositorio):

| Propiedad | Variable de entorno | Descripción |
| --------- | ------------------- | ----------- |
| `spring.datasource.url` | `URL_DB` | URL JDBC de PostgreSQL. |
| `spring.datasource.username` | `USER_NAME` | Usuario de la BD. |
| `spring.datasource.password` | `PASSWORD_DB` | Contraseña de la BD. |
| `jwt.secret.key` | `TOKEN_JWT` | Clave secreta para firmar JWT. |
| `spring.mail.username` | `USER_NAME_MAIL` | Cuenta SMTP (Gmail). |
| `spring.mail.password` | `APP_PASSWORD` | App password del correo. |
| `meli.accesToken` | `ACCESS_TOKEN` | Token de Mercado Pago. |
| `server.port` | `PORT` | Puerto HTTP (por defecto 8080). |

Otros valores fijos: puerto del servidor `8080`, expiración del JWT `86400000` ms (24 h) y Swagger en `/swagger-ui.html`.

> ⚠️ **Seguridad:** el archivo `backend/.env` contiene credenciales reales y está **ignorado por git**. No debe subirse al repositorio. Si se filtra, rota las credenciales inmediatamente.

---

## Compilación y ejecución

```bash
cd backend
./mvnw spring-boot:run          # ejecutar en local
./mvnw -q compile               # compilar
./mvnw clean package -DskipTests   # empaquetar .jar
```

Script de prueba REST de ejemplo: `src/main/java/com/example/parking_management/TestRest/TestRestLoginAdmin.rest`.

---

## Base de datos

- Motor: **PostgreSQL** (driver `org.postgresql`).
- Script base / esquema de referencia: `db/parking_management.sql`.
- En pruebas automáticas se usa **H2** en memoria (`src/test/resources/application.properties`).
