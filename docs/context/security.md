# Security — autenticación, autorización y secretos

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

## Implementado — `[CONFIRMADO]` (fuentes: `shared/security/**`, `application.properties`)

| Aspecto | Implementación |
|---|---|
| Autenticación | JWT Bearer stateless, HS256 (jjwt 0.12.3). Subject = email del usuario. Expiración 24 h (`jwt.expiration.time=86400000`). |
| Filtro | `JwtAuthenticationFilter` (OncePerRequestFilter): extrae `Authorization: Bearer`, valida firma/expiración contra `UserDetails` y setea el `SecurityContext`. |
| Contraseñas | BCrypt (`PasswordEncoder` bean). No hay flujo de registro/login implementado. |
| Sesiones | `SessionCreationPolicy.STATELESS`; CSRF deshabilitado. |
| CORS | `CorsConfigurationSource` con credenciales permitidas y métodos GET/POST/PUT/DELETE/OPTIONS. **Bug**: los orígenes están en UNA sola cadena `"http://localhost:5173/, https://...vercel.app"` → origen malformado; CORS roto para ambos frontends. Ver KI-03. |
| Rutas | `/api/auth/**` público, `/api/admin/**` requiere rol `ADMIN`, Swagger y actuator públicos, resto autenticado. |
| Secretos | `jwt.secret.key` desde env var `TOKEN_JWT` (se decodifica como BASE64 en `JwtService.getSignInKey()`); SMTP vía `USER_NAME_MAIL`/`APP_PASSWORD`; Mercado Pago vía `ACCESS_TOKEN`. Ningún secreto hardcodeado en código activo `[CONFIRMADO]` — excepción legacy en KI-02. |

**Bloqueante:** el bean `UserDetailsService` que inyectan `SecurityConfig` y `JwtAuthenticationFilter` no existe en el proyecto → la aplicación no arranca (`NoSuchBeanDefinitionException`, verificado empíricamente). Ver [known-issues.md](known-issues.md) KI-01.

## Especificado y NO implementado — `[DOCUMENTADO]`

- RBAC con tablas `ROL`/`PERMISO`/`ROL_PERMISO`, catálogo `RECURSO_ACCION` (~40 permisos), autorización por `@PreAuthorize hasAuthority(...)`.
- Login response con `accessToken` + `refreshToken` + `roles[]` + `permisos[]`; rate limiting sobre `/auth/login`; protección contra enumeración de usuarios.
- Roles: `ADMINISTRADOR` (todos los permisos) y `OPERADOR` (lecturas + altas operativas; sin tarifas/capacidad/usuarios/roles/anulaciones).
- Auditoría append-only de operaciones críticas disparada por eventos de dominio.

## Inconsistencias espec vs. código

1. La espec define roles `ADMINISTRADOR`/`OPERADOR` con permisos; el código usa rol `ADMIN` con `hasRole` (KI-07).
2. La app excluye `SecurityAutoConfiguration` pese a definir su propia cadena de seguridad (KI-04).
3. ETFv1 exige refresh token y rate limiting: inexistentes.

## Reglas de manejo de secretos

- Nunca versionar valores reales; solo nombres de variables en `.env.example`.
- Reportar secretos hardcodeados encontrados sin reproducir valores: ver KI-02 (`backend/docker-compose.yml.txt` legacy contiene contraseña MySQL y secreto JWT en texto plano dentro del repo).
