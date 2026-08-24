# Modules — inventario de paquetes

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

## Módulos especificados (ETFv1 FASE 2/4) — `[DOCUMENTADO]`, sin implementación

| Módulo (directorio previsto bajo `com.example.parking_management/`) | Contenido de dominio | Depende de |
|---|---|---|
| `cliente` | Cliente, Vehiculo, VehiculoClienteHistorial | — |
| `mensualidad` | Mensualidad, Periodo, Pago, AplicacionPago | cliente, tarifa (vía puerto) |
| `parqueo-transitorio` | Movimiento, CapacidadParqueadero | cliente, tarifa |
| `tarifa` | TarifaMensualidad, TarifaVisitante, TipoVehiculo | — |
| `seguridad` | Usuario, Rol, Permiso, Auditoria | — (transversal) |
| `reporting` | proyecciones de solo lectura | lee de los anteriores |

Estructura interna obligatoria por módulo: `in → application → domain → out`; entidades JPA jamás compartidas entre módulos.

## Código existente hoy — `[CONFIRMADO]`

| Paquete / clase | Responsabilidad real | Notas |
|---|---|---|
| `ParkingManagementApplication` | Entrypoint Spring Boot | Excluye `SecurityAutoConfiguration` pese a tener `SecurityConfig` propio — ver [known-issues.md](known-issues.md) KI-04 |
| `shared.security.config.SecurityConfig` | Filter chain: JWT filter, CORS, BCrypt, stateless, reglas por ruta | Ver [security.md](security.md) |
| `shared.security.jwt.JwtService` | Emisión/extracción/validación JWT HS256 | Secret desde `jwt.secret.key` (`TOKEN_JWT`), expiración 24 h fija en properties |
| `shared.security.jwt.JwtAuthenticationFilter` | Extrae y valida `Authorization: Bearer`, carga `UserDetailsService` | Bean `UserDetailsService` no existe → app no arranca (KI-01) |
| `shared.documentation.SwaggerOpenApiConfig` | OpenAPI info + security scheme `bearerAuth` | |
| `shared.audit.Auditable<U>` | Clase mapeable base para auditoría JPA (`@EntityListeners`) | Tiene bugs y nadie la usa aún (KI-05) |
| `notification.infrastructure.config.MailConfig` | `JavaMailSender` SMTP Gmail + plantilla `SimpleMailMessage` | Sin consumidor; hardcodea host/puerto (KI-06) |
| `testRest.TestRestLoginAdmin.rest` | Archivo `.rest` legado con endpoint inexistente | AGENTS.md lo declara legado; no copiar más `.rest` a `src/main/java` |

## Referencias

- [domain.md](domain.md) — modelo de dominio especificado
- [architecture.md](architecture.md) — reglas estructurales por módulo
