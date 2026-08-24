# Integrations — servicios externos

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

## 1. Mercado Pago (pagos) — dependencia presente, sin uso — `[CONFIRMADO]`

- SDK `com.mercadopago:sdk-java:2.1.7` en el pom; **ninguna clase lo importa ni lo usa**.
- Configuración preparada en `application.properties`: `meli.accesToken=${ACCESS_TOKEN}` y `mercado.pago.url.base=https://api.mercadopago.com/v1/payments/`. Ningún bean/código la consume.
- La espec ETFv1 no define el flujo de pago electrónico (el MVP modela pago registrado por operador); la integración es preparación futura. `[INFERIDO]`
- Variable: `ACCESS_TOKEN` — token de acceso de Mercado Pago, vía env.

## 2. Email SMTP Gmail (notificaciones) — configurado, sin consumidor — `[CONFIRMADO]`

- `spring-boot-starter-mail`; `MailConfig` publica `JavaMailSender` (smtp.gmail.com:587, STARTTLS) y un `SimpleMailMessage` plantilla. Nadie envía correos aún.
- Duplicación: host/puerto están tanto en `application.properties` como hardcodeados en `MailConfig` (KI-06). `mail.debug=true` activo.
- Variables: `USER_NAME_MAIL`, `APP_PASSWORD` (App Password de Gmail), vía env.
- En la espec, notificaciones son Epic E8 (`Could`, fuera del MVP) disparadas por eventos de dominio; canal sin definir (email/SMS/WhatsApp).

## 3. Prometheus / Grafana / Graphite (monitoreo) — `[CONFIRMADO]`

El backend expone métricas Micrometer/Prometheus; el stack completo se describe en [infrastructure.md](infrastructure.md). Graphite está desplegado pero **el backend no envía nada a Graphite hoy** (no hay registry Graphite en pom/properties) `[INFERIDO]` — su rol actual es pasivo/recepción potencial.

## Resumen de variables externas

| Variable | Propósito | Consumidor real |
|---|---|---|
| `ACCESS_TOKEN` | Mercado Pago | solo properties, sin uso |
| `USER_NAME_MAIL` / `APP_PASSWORD` | SMTP Gmail | MailConfig |
| `URL_DB` / `USER_NAME` / `PASSWORD_DB` | PostgreSQL | datasource |
| `TOKEN_JWT` | secreto firma JWT | JwtService |

Nunca versionar valores reales de estas variables (ver `.env.example`).
