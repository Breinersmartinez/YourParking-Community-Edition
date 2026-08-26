# Testing — estrategia y estado

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

## Estado real — `[CONFIRMADO]`

- **Un solo test**: `backend/src/test/java/com/example/parking_management/ParkingManagementApplicationTests.java` — `@SpringBootTest contextLoads()` (prueba que el contexto Spring carga).
- **El test FALLA en HEAD**: el contexto no carga por falta de bean `UserDetailsService` (KI-01). Verificado localmente y corroborado por GitHub Actions (job `CI` = failure en `develop`).
- Cobertura: JaCoCo 0.8.12 configurado en `verify` (`prepare-agent` + `report`); reporte en `target/site/jacoco`; sin umbral mínimo exigido (comentario del pom lo deja para cuando crezcan los tests). CI sube el reporte como artefacto.
- No hay Testcontainers: CI levanta un servicio `postgres:16-alpine` real y pasa las variables de entorno dummy.
- Artefactos `.rest` en `src/test/resources/http/` apuntan a un endpoint inexistente (`POST /Administrador/login`) — no ejecutables, legado.

## Estrategia esperada según espec — `[DOCUMENTADO]`

ETFv1 FASE 4 §1 justifica hexagonal para poder testear reglas de negocio (estado de periodo, cobro, cupos) sin BD ni framework web → cuando exista dominio, tests unitarios puros de dominio son la prioridad; transacciones al borde de application.

## Cómo correr los tests

Ver [development-guide.md](development-guide.md) (requiere Postgres + variables de entorno).

## Referencias

- [infrastructure.md](infrastructure.md) — pipeline CI que ejecuta `mvn verify`
