# API — contrato REST

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

## Endpoints implementados: NINGUNO

`[CONFIRMADO]` No existe ningún `@RestController`, handler ni mapeo en el código. La única superficie HTTP real es la de Swagger UI (`/swagger-ui.html`, `/v3/api-docs`) y Actuator (`/actuator/health`, `/actuator/prometheus`) por configuración.

## Convenciones acordadas (espec) — `[DOCUMENTADO]`

- Prefijos por módulo: `/api/clientes`, `/api/mensualidades`, `/api/parqueo`, `/api/tarifas`, `/api/seguridad`, `/api/reportes` (ETFv1 FASE 4 §7). El `SecurityConfig` actual ya reserva `/api/auth/**` (público) y `/api/admin/**` (rol ADMIN).
- Envelope estándar de respuesta para TODA la API (éxito y error): `{ success, message, data, timestamp }`; errores agregan `errorCode` tipo `"MONTO_INVALIDO"` (ETFv1 FASE 5 §6; heredado del proyecto "Medical Management" — no existe aquí aún `[CONFIRMADO]`).
- Login devuelve `accessToken`, `refreshToken`, `roles[]`, `permisos[]` (Actualización Roles y Permisos §4). **No hay implementación de refresh token ni de emisión de login** — `JwtService` solo genera tokens desde un `UserDetails`.
- Autorización por permiso, no por rol: `@PreAuthorize("hasAuthority('PAGOS_CREATE')")` con catálogo `RECURSO_ACCION`. El código actual usa `hasRole("ADMIN")` sobre `/api/admin/**` — desalineado con la espec (ver [known-issues.md](known-issues.md) KI-07).
- DTOs/records para entrada y salida; nunca exponer entidades de dominio. Paginación obligatoria en listados.
- Manejo de errores vía `GlobalExceptionHandler` que mapea `DomainException.codigo()` a la respuesta estándar.
- Documentación interactiva: Swagger con esquema `bearerAuth` `[CONFIRMADO]` en `shared/documentation/SwaggerOpenApiConfig.java`.

## Seguridad de la superficie HTTP actual — `[CONFIRMADO]`

| Ruta | Acceso |
|---|---|
| `/api/auth/**` | público |
| `/v3/api-docs/**`, `/swagger-ui*`, `/swagger-resources/**`, `/webjars/**` | público |
| `/actuator/health`, `/actuator/prometheus` | público |
| `/api/admin/**` | rol `ADMIN` |
| resto | autenticado |

Ver [security.md](security.md) para el detalle del filtro JWT.

## Referencias

- [domain.md](domain.md) — casos de uso UC1–UC23 que estos endpoints expondrán
- [business-rules.md](business-rules.md) — RN8/RN9 condicionan permisos por endpoint
