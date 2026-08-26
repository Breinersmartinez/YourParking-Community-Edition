# AGENTS.md

## Qué es esto

API REST de gestión de parqueadero: Spring Boot 3.4.3, Java 17, PostgreSQL 16, seguridad JWT, pagos Mercado Pago, métricas Prometheus/Grafana.
Monolito modular hexagonal en pleno refactor: existe un directorio por módulo bajo `com.example.parking_management`, pero hoy solo tienen código `shared/`, `notification/` y la clase principal.
`frontend/` y `db/parking_management.sql` están VACÍOS; la especificación vigente es `docs/ETFv1` (FASE 1–6).

## Cómo se corre

Stack completo (backend + Postgres + Prometheus + Grafana + Graphite): `cp .env.example .env` (completar valores) y luego `docker compose up -d --build`. Backend :8080, Swagger `/swagger-ui.html`, Grafana :3000, Prometheus :9090, Graphite UI :8282.
Solo backend local: exporta `URL_DB`, `USER_NAME`, `PASSWORD_DB`, `TOKEN_JWT`, `USER_NAME_MAIL`, `APP_PASSWORD`, `ACCESS_TOKEN` (apuntando a un Postgres 16) y corre `./mvnw spring-boot:run` dentro de `backend/` — `application.properties` no tiene defaults y falla sin esas variables.
Verificación igual que CI (necesita Postgres arriba + esas variables): `cd backend && ./mvnw -B -ntp verify`.

## Convenciones

Módulos = un directorio por bounded context en `backend/src/main/java/com/example/parking_management/`, nombres singulares en inglés (`user`, `vehicle`, `payment`); lo transversal va en `shared/`.
Estructura interna de cada módulo (docs/ETFv1/FASE 4): `in` → `application` → `domain` → `out`; reglas de negocio SOLO en `domain`; `@Transactional` al borde de `application`; entidades JPA jamás compartidas entre módulos.
Un controller por módulo bajo prefijo `/api/<modulo>`; solo traduce HTTP↔caso de uso.
Configuración exclusivamente por variables de entorno con los nombres exactos que consume `application.properties`; cero secretos ni valores hardcodeados en el código.
Español para comentarios, docs y mensajes de commit; commits con prefijo de módulos afectados (ej.: `ci+docs:`, `infra+backend:`).
YAML debe pasar `.yamllint` y `docker compose config --quiet` (lo valida CI); ramas: `main`, `develop*`, `feature/**`.
Cambios de diseño se documentan en la FASE correspondiente de `docs/ETFv1`, no en el README.

## Qué NO hacer

NO uses `README.md` como fuente de configuración: menciona MySQL, `SPRING_DATASOURCE_*` y `JWT_SECRET`, que NO existen; los nombres reales son los de `docker-compose.yml` y `application.properties`.
NO toques `db/parking_management.sql` salvo para cambiar el modelo de datos: es EL esquema del proyecto (confirmado por el dueño) y `docker-compose.yml` lo monta como init de Postgres; tras editarlo hay que recrear el volumen (`docker compose down -v`) para que vuelva a ejecutarse.
NO metas lógica de negocio en controllers/repositories, ni propongas microservicios o infra nueva: decisión anti-sobreingeniería cerrada en ETFv1/FASE 4.
NO trabajes sobre `frontend/`: vacío, stack sin definir (PENDIENTE).
NO copies más archivos de prueba `.rest` dentro de `src/main/java` (el de `testRest/` es legado).
