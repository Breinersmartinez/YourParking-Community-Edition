# Conventions — estilo y patrones observados

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

## Observadas en el código existente — `[CONFIRMADO]`

| Convención | Evidencia |
|---|---|
| Comentarios en español, Javadoc ligero inline | `JwtService`, `SecurityConfig`, `MailConfig` |
| Inyección por constructor (con `@RequiredArgsConstructor` o explícita) | `JwtAuthenticationFilter`, `SecurityConfig` |
| Lombok disponible (`@Getter/@Setter/@Data`, processor en pom) | `Auditable` |
| Config por `@Value("${...}")` mapeando env vars | `JwtService`, `MailConfig` |
| Paquetes por capacidad (`shared/security/jwt`, `notification/infrastructure/config`) | árbol actual ya anticipa capas hexagonales (`infrastructure/config`) |
| Nombres de propiedades kebab-case en Spring | `jwt.secret.key`, `springdoc.api-docs.path` |

## Prescritas por ETFv1 / AGENTS.md — `[DOCUMENTADO]` (a seguir al implementar)

- Módulos singulares en inglés; estructura `in/application/domain/out`; dominio sin dependencias de framework.
- Registros Java (records) para DTOs; `Optional<T>` en consultas; `BigDecimal` via VO `Dinero` para dinero (nunca float/double); enums cerrados para catálogos.
- Excepciones de dominio con `codigo()` mapeado a `errorCode` del envelope API.
- Paginación obligatoria en listados históricos.

## Antipatrones presentes que NO deben imitarse

Ver [known-issues.md](known-issues.md): imports duplicados (KI-04), strings de orígenes CORS concatenados (KI-03), anotación de auditoría incorrecta (KI-05), mezcla de APIs deprecated de jjwt (KI-08), hardcodeo de config duplicada (KI-06).
