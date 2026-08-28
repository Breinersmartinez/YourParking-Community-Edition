# 🌐 Referencia de la API REST

Base URL (local): `http://localhost:8080`

Todas las rutas protegidas requieren la cabecera:

```
Authorization: Bearer <jwt>
```

Formato de cuerpo y respuestas: `application/json`.

---

## Autenticación

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| POST | `/api/auth/login` | Inicia sesión con `{ email, password }`. Devuelve token + datos de usuario. |
| POST | `/api/auth/register` | Registra una nueva cuenta de usuario. |

---

## Usuarios

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/api/users` | Lista todos los usuarios. |
| GET | `/api/users/me` | Datos del usuario autenticado (se usa para obtener `idCard` tras login). |
| GET | `/api/users/{idCard}` | Obtiene un usuario por documento. |
| GET | `/api/users/active` | Lista usuarios activos. |
| GET | `/api/users/role/{role}` | Lista usuarios por rol (`ADMIN`, `OPERATOR`, `SUPERVISOR`, `VIGILANTE`, `USER`). |
| PUT | `/api/users/{idCard}` | Actualiza un usuario. |
| DELETE | `/api/users/{idCard}` | Elimina un usuario. |
| PATCH | `/api/users/{idCard}/activate` | Activa un usuario. |
| PATCH | `/api/users/{idCard}/deactivate` | Desactiva un usuario. |

---

## Niveles (Pisos)

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/api/levels` | Lista niveles. |
| GET | `/api/levels/{id}` | Obtiene un nivel. |
| POST | `/api/levels` | Crea un nivel. |
| PUT | `/api/levels/{id}` | Actualiza un nivel. |
| DELETE | `/api/levels/{id}` | Elimina un nivel. |

---

## Zonas (Sectores)

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/api/zones` | Lista zonas. |
| GET | `/api/zones/{id}` | Obtiene una zona. |
| GET | `/api/zones/level/{idPiso}` | Zonas de un nivel. |
| POST | `/api/zones` | Crea una zona. |
| PUT | `/api/zones/{id}` | Actualiza una zona. |
| DELETE | `/api/zones/{id}` | Elimina una zona. |

---

## Espacios

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/api/spaces` | Lista espacios. |
| GET | `/api/spaces/{id}` | Obtiene un espacio. |
| GET | `/api/spaces/state/{state}` | Espacios por estado (`DISPONIBLE`, `OCUPADO`, `RESERVADO`, `MANTENIMIENTO`). |
| GET | `/api/spaces/level/{idPiso}` | Espacios de un nivel. |
| GET | `/api/spaces/zone/{idZona}` | Espacios de una zona. |
| GET | `/api/spaces/available/count` | Conteo de espacios disponibles (usado en el dashboard). |
| POST | `/api/spaces` | Crea un espacio. |
| PUT | `/api/spaces/{id}` | Actualiza un espacio. |
| PATCH | `/api/spaces/{id}/state?state={state}` | Cambia el estado de un espacio. |
| DELETE | `/api/spaces/{id}` | Elimina un espacio. |

---

## Vehículos

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/api/vehicles` | Lista vehículos. |
| GET | `/api/vehicles/{plate}` | Obtiene por placa. |
| GET | `/api/vehicles/owner/{idCard}` | Vehículos de un propietario. |
| POST | `/api/vehicles` | Registra un vehículo. |
| DELETE | `/api/vehicles/{plate}` | Elimina un vehículo. |

---

## Tickets (entrada/salida)

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/api/tickets` | Lista tickets. |
| GET | `/api/tickets/{id}` | Obtiene un ticket. |
| GET | `/api/tickets/vehicle/{plate}` | Tickets de un vehículo. |
| POST | `/api/tickets/entry` | Registra la entrada de un vehículo. |
| POST | `/api/tickets/{id}/close` | Cierra el ticket (salida) con `{ exitDate }` opcional. |
| POST | `/api/tickets/{id}/cancel` | Cancela un ticket. |

---

## Reservas

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/api/reservations` | Lista reservas. |
| GET | `/api/reservations/{id}` | Obtiene una reserva. |
| GET | `/api/reservations/user/{idCard}` | Reservas de un usuario. |
| GET | `/api/reservations/space/{idEspacio}` | Reservas de un espacio. |
| POST | `/api/reservations` | Crea una reserva. |
| PATCH | `/api/reservations/{id}/state?estado={estado}` | Cambia el estado (`PENDIENTE`, `CONFIRMADA`, `CANCELADA`, `CUMPLIDA`). |
| DELETE | `/api/reservations/{id}` | Elimina una reserva. |

---

## Pagos

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/api/payments` | Lista pagos. |
| GET | `/api/payments/{id}` | Obtiene un pago. |
| GET | `/api/payments/state/{estado}` | Pagos por estado (`PENDIENTE`, `PAGADO`, `CANCELADO`). |
| POST | `/api/payments` | Crea un pago. |
| DELETE | `/api/payments/{id}` | Elimina un pago. |

---

## Tarifas

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/api/rates` | Lista tarifas. |
| GET | `/api/rates/{id}` | Obtiene una tarifa. |
| GET | `/api/rates/calculate?tipoVehiculo=&entry=&exit=` | Calcula el costo según tipo y horario. |
| POST | `/api/rates` | Crea una tarifa. |
| PUT | `/api/rates/{id}` | Actualiza una tarifa. |
| DELETE | `/api/rates/{id}` | Elimina una tarifa. |

---

## Suscripciones (Abonos)

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/api/subscriptions` | Lista suscripciones. |
| GET | `/api/subscriptions/{id}` | Obtiene una suscripción. |
| GET | `/api/subscriptions/user/{idCard}` | Suscripciones de un usuario. |
| POST | `/api/subscriptions` | Crea una suscripción. |
| PATCH | `/api/subscriptions/{id}/state?estado={estado}` | Cambia el estado (`ACTIVO`, `VENCIDO`, `CANCELADO`). |
| DELETE | `/api/subscriptions/{id}` | Elimina una suscripción. |

---

## Incidentes

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/api/incidents` | Lista incidentes. |
| GET | `/api/incidents/{id}` | Obtiene un incidente. |
| GET | `/api/incidents/state/{estado}` | Incidentes por estado (`REPORTADO`, `EN_PROCESO`, `RESUELTO`). |
| GET | `/api/incidents/vehicle/{plate}` | Incidentes de un vehículo. |
| POST | `/api/incidents` | Registra un incidente. |
| PATCH | `/api/incidents/{id}/state?estado={estado}` | Cambia el estado. |
| DELETE | `/api/incidents/{id}` | Elimina un incidente. |

---

## Integraciones

- **Mercado Pago**: el backend expone endpoints de pagos e integra el SDK. Requiere el token `ACCESS_TOKEN` (variable de entorno).
- **Email (SMTP Gmail)**: envío de correos transaccionales mediante `spring.mail.*`.

---

> **Nota:** esta referencia replica los endpoints declarados en `frontend/src/services/index.js`. Si se agrega un endpoint nuevo, conviene actualizar ese archivo y esta documentación a la vez.
