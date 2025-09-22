# Parking Management API

Parking Management API is a RESTful system developed with **Spring Boot 3.4.3** for managing parking facilities.  
It includes JWT authentication, user management (administrators and clients), vehicle registration, reservations, ticket generation, and payment processing.

Demo: [https://parking-management-api-k4ih.onrender.com/](https://parking-management-api-k4ih.onrender.com/)  
Swagger UI: [https://parking-management-api-k4ih.onrender.com/swagger-ui.html](https://parking-management-api-k4ih.onrender.com/swagger-ui.html)

---

## Main Features

- Authentication and Roles  
  - Administrators and clients with permission control using Spring Security + JWT.  
  - Passwords encrypted with BCrypt.  

- Parking Management  
  - Vehicle registration and tracking.  
  - Space management and availability monitoring.  
  - Reservation system and entry/exit ticket management.  

- Payments and Pricing  
  - Dynamic pricing configurable by vehicle type (hourly, daily, monthly, yearly).  
  - Payment tracking with multiple methods.  
  - Automatic billing calculation based on parking duration.  

- Integrated Documentation  
  - Swagger UI and OpenAPI 3.0 available at `/swagger-ui.html`.  

- Infrastructure and Deployment  
  - Persistence with **MySQL 8.0**.  
  - Containerization with **Docker** and orchestration using **Docker Compose**.  
  - CORS enabled for multiple frontend applications.  
  - Stateless architecture with JWT → horizontally scalable.  

---

## Architecture

- Backend: Spring Boot 3.4.3 (REST API)  
- Security: Spring Security + JWT  
- Persistence: Spring Data JPA + PostgreSQL 
- Documentation: SpringDoc OpenAPI 2.8.6 (Swagger UI)  
- Infrastructure: Docker, Docker Compose  
- Build: Maven 3.x  
- Runtime: Java 17  

Data model includes entities for `User`, `Vehicle`, `ParkingSpace`, `Reservation`, `Ticket`, `Payment`.  

---

## Installation and Running

### Prerequisites
- Java 17+  
- Maven 3.6+ (or use the included wrapper `./mvnw`)  
- Postgres 17  
- Docker (optional)  

---

### Local Execution
Clone the repository:
```bash
git clone https://github.com/Breynersmartinez/parking-management-api.git
cd parking-management-api
````

Compile and run:

```bash
./mvnw spring-boot:run
```

API access:

```
http://localhost:8080
```

Swagger UI access:

```
http://localhost:8080/swagger-ui.html
```

---

### Docker Execution

Build and run with Docker:

```bash
docker build -t parking-management-api .
docker run -p 8080:8080 parking-management-api
```

Or with Docker Compose (API + MySQL):

```bash
docker-compose up --build
```

Services:

* API → `http://localhost:8080`
* PostgreSQL → localhost:5432

---

## Main Environment Variables

| Variable                     | Description                   |
| ---------------------------- | ----------------------------- |
| `SPRING_DATASOURCE_URL`      | URL de conexión a PostgreSQL / PostgreSQL connection URL         |
| `SPRING_DATASOURCE_USERNAME` | Database user                 |
| `SPRING_DATASOURCE_PASSWORD` | Database password             |
| `JWT_SECRET`                 | Secret key to sign JWT tokens |
| `JWT_EXPIRATION`             | Token expiration time         |

---

## Documentation

* Online API: [Swagger UI](https://parking-management-api-k4ih.onrender.com/swagger-ui.html)
* DeepWiki: [Detailed documentation](https://deepwiki.com/Breynersmartinez/parking-management-api)

---

## Author

Breiner Martínez

* GitHub: [@Breynersmartinez](https://github.com/Breynersmartinez)
* Portfolio: https://my-portfolio-tau-green-52.vercel.app





