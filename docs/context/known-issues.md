# Known Issues — deuda técnica, inconsistencias y discrepancias

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

## Bloqueantes

### KI-01 — La aplicación no arranca: falta bean `UserDetailsService` `[CONFIRMADO]`
`SecurityConfig` y `JwtAuthenticationFilter` inyectan `UserDetailsService`, pero no existe ninguna implementación en el proyecto (ni entidad Usuario). Verificado empíricamente: `mvnw test` falla con `NoSuchBeanDefinitionException: No qualifying bean of type 'org.springframework.security.core.userdetails.UserDetailsService'`. Corroborado por GitHub Actions: job `CI` = **failure** en HEAD/develop. El único test del repo (`contextLoads`) no pasa.

### KI-02 — Secretos hardcodeados versionados (legacy) `[CONFIRMADO]`
`backend/docker-compose.yml.txt` (archivo muerto que no usa Compose) contiene credenciales MySQL y un secreto JWT en texto plano, commiteados al historial. No se reproducen los valores aquí. `[RECOMENDACIÓN]` Eliminar el archivo y, si el historial importa, rotar esas credenciales (aunque parecen de un entorno viejo de MySQL ya abandonado).

## Bugs funcionales

### KI-03 — CORS malformado `[CONFIRMADO]`
En `SecurityConfig.corsConfigurationSource()`: `configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173/, https://aplicacion-de-gestion-para-parqueadero.vercel.app"))` — es UNA sola cadena con dos orígenes dentro; la lista contiene un único origen inválido `"http://localhost:5173/, https://..."`. CORS está efectivamente roto para ambos frontends (y `allowCredentials(true)` lo agrava).

### KI-04 — Configuración de seguridad contradictoria + imports duplicados `[CONFIRMADO]`
1. `ParkingManagementApplication` excluye `SecurityAutoConfiguration` mientras existe `SecurityConfig` propio con `@EnableWebSecurity` — confuso y frágil (contribuye a KI-01 al desactivar el auto-config in-memory de `UserDetailsService`).
2. `SecurityConfig` tiene imports duplicados (bloques repetidos) y declara `/api/auth/**` como matcher dos veces.

### KI-05 — `Auditable` rota y sin usar `[CONFIRMADO]`
`shared/audit/Auditable.java`: `lastModifiedDate` está anotado con `@LastModifiedBy` (debería ser `@LastModifiedDate`); falta habilitar `@EnableJpaAuditing` en algún lado; nadie extiende la clase; columna `ULTIMA_MODIFICACION_Date` con naming inconsistente.

### KI-06 — `MailConfig` duplica config y activa debug `[CONFIRMADO]`
Host/puerto hardcodeados (`smtp.gmail.com:587`) duplicando `application.properties`; `mail.debug=true`; plantilla con subject placeholder "Your message". Sin consumidor del bean.

## Inconsistencias documentación ↔ código

### KI-07 — Modelo de autorización desalineado `[CONFIRMADO]`
Espec (Actualización Roles y Permisos): roles `ADMINISTRADOR`/`OPERADOR` + permisos finos vía `hasAuthority`. Código actual: rol `ADMIN` con `hasRole("ADMIN")` sobre `/api/admin/**`. Al implementar módulos, decidir cuál prevalece y ajustar (la espec es la intención vigente).

### KI-08 — `JwtService` mezcla APIs deprecated y nuevas de jjwt 0.12 `[CONFIRMADO]`
Builder con `setClaims/setSubject/signWith(SignatureAlgorithm.HS256)` (deprecated) junto a parser nuevo (`verifyWith/parseSignedClaims`). Además el secreto se interpreta BASE64 (`Decoders.BASE64.decode`) → `TOKEN_JWT` debe entregarse en Base64 o fallará la firma/validación.

### KI-09 — Java 17 vs JDK 23 `[CONFIRMADO]`
pom y CI usan Java 17; `backend/Dockerfile` construye y corre con `eclipse-temurin:23-jdk/jre`. Funciona (bytecode target 17), pero es inconsistencia de toolchain sin razón documentada.

### KI-10 — Prometheus scrapea Graphite en puerto probablemente erróneo `[CONFIRMADO]`
`docker/prometheus/prometheus.yml`: comentario dice "puerto 8088" pero target es `graphite:8080`; la UI de Graphite vive en 80 (mapeada a host 8282). Scrape probablemente en error permanente.

### KI-11 — README.md desactualizado y erróneo `[CONFIRMADO]`
Menciona: MySQL 8.0 como persistencia (real: PostgreSQL), variables `SPRING_DATASOURCE_URL/USERNAME/PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION` (reales: `URL_DB`, `USER_NAME`, `PASSWORD_DB`, `TOKEN_JWT`), instrucción `docker-compose up --build` con MySQL, prerequisito "Postgres 17" (compose usa 16), URL de clone de otro repo (`parking-management-api`). AGENTS.md ya advierte no usarlo como fuente. Badges de CI muestran estado failure real.

### KI-12 — Esquema de BD vacío vs. espec completa `[CONFIRMADO]`
`db/parking_management.sql` (0 bytes) monta como init de Postgres; ETFv1 FASE 3 define 14+ tablas. No hay herramienta de migraciones (Flyway/Liquibase ausentes del pom).

### KI-13 — Archivos vacíos / legado / boilerplate `[CONFIRMADO]`
`docs/AplicationOperation.md`, `docs/Borrador.md`, `docs/Requeriments.md` (0 bytes); `docs/HELP.md` (boilerplate Spring); `.rest` heredados en `src/main/java/testRest/` y `src/test/resources/http/` apuntando a endpoint inexistente `/Administrador/login`; `pom.xml` con description "Demo project for Spring Boot"; `spring-boot-starter-data-jdbc` junto a data-jpa (posiblemente redundante).

### KI-14 — Dependencias declaradas sin uso `[CONFIRMADO]`
SDK Mercado Pago y starter mail están en pom/config pero ninguna clase los consume (ver [integrations.md](integrations.md)).

## Evidencia insuficiente / incertidumbres

- No se pudo verificar arranque contra Postgres real (credenciales locales desconocidas); KI-01 se validó con conexiones diferidas — conclusión válida porque el fallo es de wiring de beans, independiente de BD.
- Estado exacto de ramas remotas y PRs históricos no auditado a fondo (solo runs recientes de Actions).
- `[INFERIDO]` El repo parece derivar de un proyecto anterior ("parking-management-api", referencias a Medical Management): README/demo/GHCR apuntan allí; no verificado más allá de indicios.
