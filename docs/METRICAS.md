# 📈 Métricas y Monitoreo — YourParking

YourParking expone métricas de su backend (Spring Boot) vía **Spring Boot Actuator** y **Micrometer**, y las visualiza con un stack de **Prometheus + Grafana**.

## Stack

| Componente | Rol | URL local |
| ---------- | --- | --------- |
| **Actuator** | Expone los endpoints de métricas del backend. | `http://localhost:8080/actuator/prometheus` |
| **Prometheus** | Recopila y almacena las métricas (scraping cada 15s). | `http://localhost:9090` |
| **Grafana** | Dashboards y alertas visuales. | `http://localhost:3000` (admin/admin) |

## Arquitectura

```
Backend Spring Boot  ──bare /actuator/prometheus──▶  Prometheus  ──▶  Grafana
  (Actuator + Micrometer)                                 │
                                                          └── alertas (opt.)
```

El backend publica métricas estándar de la JVM (heap, GC, hilos) y del servidor web (requests HTTP con su status, duración y endpoint).

## Cómo funciona

1. **Backend**: las dependencias `spring-boot-starter-actuator` y `micrometer-registry-prometheus` habilitan el endpoint `/actuator/prometheus`, que expone métricas en formato Prometheus text.
2. **Security**: el endpoint de métricas está **público** (sin JWT) para que Prometheus pueda hacer scraping.
3. **Prometheus** consulta ese endpoint periódicamente y guarda las series en su TSDB.
4. **Grafana** lee de Prometheus y muestra los dashboards provisionados.

## Puesta en marcha

### 1. Levantar el backend

```bash
cd backend
# configura tus variables de entorno (URL_DB, USER_NAME, ...)
mvn spring-boot:run
```

Verifica que el endpoint responde:

```bash
curl http://localhost:8080/actuator/prometheus   # debe devolver texto de métricas
curl http://localhost:8080/actuator/health       # {"status":"UP"}
```

### 2. Levantar el stack de monitoreo

```bash
cd metrics
docker compose up -d
```

- **Prometheus** → http://localhost:9090
- **Grafana** → http://localhost:3000 (usuario/contraseña por defecto: `admin` / `admin`)

Grafana ya trae provisionados el datasource `Prometheus` y el dashboard **"YourParking - Métricas del Backend"**.

> **Nota:** por defecto Prometheus hace scraping de `host.docker.internal:8080` (el backend corriendo en el host). Si tu backend vive en un contenedor, edita `metrics/prometheus/prometheus.yml` y apunta al alias de red del contenedor (p. ej. `backend:8080`).

### 3. Detener

```bash
cd metrics
docker compose down        # no borra datos (volúmenes persistentes)
docker compose down -v     # borra también los datos recopilados
```

## Métricas clave disponibles

| Métrica | Descripción |
| ------- | ----------- |
| `jvm_memory_used_bytes` / `jvm_memory_max_bytes` | Uso de memoria de la JVM (heap / non-heap). |
| `jvm_gc_pause_seconds*` | Pausas del Garbage Collector. |
| `http_server_requests_seconds_count/sum` | Requests HTTP: cuenta, duración y status por endpoint. |
| `process_start_time_seconds` | Para calcular el uptime del proceso. |
| `jvm_threads_live_threads` | Número de hilos vivos. |
| `jvm_classes_loaded_classes` | Clases cargadas en la JVM. |

## Dashboard de Grafana

El dashboard provisionado `yourparking-metrics.json` incluye paneles de:

- Uptime del backend.
- Memoria heap JVM libre.
- Tráfico HTTP (requests/s).
- Errores HTTP 5xx.
- Latencia media HTTP.

Los datos se refrescan cada 15s y se muestran los últimos 30 minutos por defecto (cambiable desde el selector de tiempo).

## Alertas (Prometheus)

En `metrics/prometheus/alerting-rules.yml` hay reglas de ejemplo (backend caído, errores 5xx altos, uso de heap alto). Se consultan en la pestaña *Alerts* de Prometheus. Para recibirlas por email/Slack/Telegram es necesario configurar un **Alertmanager** (fuera del alcance de este repo por ahora).

## Seguridad

- El endpoint `/actuator/prometheus` está permitido en `SecurityConfig` porque expone **solo métricas**, no datos sensibles de la aplicación.
- **No expongas el endpoint de métricas a Internet** en producción; restringelo a la red interna de monitoreo o protégelo.
- El datasource de Grafana apunta a Prometheus internamente (`prometheus:9090`), sin exponer credenciales.
- Credenciales por defecto de Grafana (`admin/admin`): cámbialas al primer inicio en producción.
