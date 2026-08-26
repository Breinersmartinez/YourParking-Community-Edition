# =============================================================================
#  YourParking - Community Edition | Automatización de tareas
#
#  Uso:  make <target>   (o solo `make` para ver esta ayuda)
# =============================================================================

.DEFAULT_GOAL := help
COMPOSE       := docker compose
MVN           := ./mvnw
BACKEND_ENV   := backend/.env

.PHONY: help env up down restart stop rebuild logs ps db-up db-down db-restart \
        run compile test verify ui-test check-config clean db-reset

# ---------------------------------------------------------------- Ayuda ------
help: ## Muestra esta ayuda
	@echo "YourParking - tareas automatizadas"
	@echo ""
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

# ------------------------------------------------------------- Entorno -------
env: ## Crea .env raíz desde .env.example (luego complétalo con tus valores)
	@test -f .env && echo ".env ya existe: edítalo directamente" \
		|| (cp .env.example .env && echo ".env creado — completa POSTGRES_*, TOKEN_JWT, USER_NAME_MAIL, APP_PASSWORD y ACCESS_TOKEN")

# ----------------------------------------------------------- Contenedores ----
up: ## Levanta todo el stack (build incluido): backend + db + monitoreo
	@test -f .env || (echo "Falta .env raíz. Ejecuta primero: make env" && exit 1)
	$(COMPOSE) up -d --build
	@echo "Backend http://localhost:8080 · Grafana :3000 · Prometheus :9090 · Graphite :8282"

down: ## Baja todo el stack (conserva volúmenes)
	$(COMPOSE) down

restart: ## Reinicia los contenedores existentes sin reconstruir
	$(COMPOSE) restart

stop: ## Detiene los contenedores sin eliminarlos
	$(COMPOSE) stop

rebuild: ## Recrea e inicia el stack reconstruyendo imágenes
	@test -f .env || (echo "Falta .env raíz. Ejecuta primero: make env" && exit 1)
	$(COMPOSE) up -d --force-recreate --build

ps: ## Estado de los servicios
	$(COMPOSE) ps

# SERVICE=<servicio> para ver uno solo: make logs SERVICE=db
logs: ## Sigue los logs (SERVICE=<servicio> opcional: db|backend|prometheus|grafana|graphite)
	$(COMPOSE) logs -f --tail=100 $(SERVICE)

# ------------------------------------------------------------ Base de datos --
db-up: ## Levanta solo PostgreSQL
	@test -f .env || (echo "Falta .env raíz. Ejecuta primero: make env" && exit 1)
	$(COMPOSE) up -d db
	@until $(COMPOSE) exec db pg_isready -q; do sleep 1; done
	@echo "PostgreSQL listo en localhost:5432"

db-down: ## Detiene solo PostgreSQL
	$(COMPOSE) rm -sf db

db-restart: ## Reinicia solo PostgreSQL
	$(COMPOSE) restart db

# ADVERTENCIA: borra datos. Úsalo tras editar db/parking_management.sql
db-reset: ## Recrea el volumen de la BD desde cero (ejecuta el init SQL otra vez)
	@test -f .env || (echo "Falta .env raíz. Ejecuta primero: make env" && exit 1)
	$(COMPOSE) down -v
	$(MAKE) db-up

# --------------------------------------------------------- Backend (local) ---
# Requiere backend/.env apuntando a un Postgres accesible
run: ## Corre el backend en local con Spring Boot (usa backend/.env)
	@test -f $(BACKEND_ENV) || (echo "Falta $(BACKEND_ENV)" && exit 1)
	set -a && . $(BACKEND_ENV) && set +a && cd backend && $(MVN) spring-boot:run

compile: ## Compila rápido sin BD
	cd backend && $(MVN) -B -ntp -q compile

test: ## Ejecuta los tests (requiere BD accesible; usa backend/.env)
	@test -f $(BACKEND_ENV) || (echo "Falta $(BACKEND_ENV)" && exit 1)
	set -a && . $(BACKEND_ENV) && set +a && cd backend && $(MVN) -B -ntp test

verify: ## Verificación completa igual que CI (compila + tests + cobertura JaCoCo)
	@test -f $(BACKEND_ENV) || (echo "Falta $(BACKEND_ENV)" && exit 1)
	set -a && . $(BACKEND_ENV) && set +a && cd backend && $(MVN) -B -ntp verify

# SELENIUM_BASE_URL=http://localhost:<front> make ui-test
ui-test: ## Pruebas E2E Selenium contra una URL dada (requiere frontend corriendo)
	@test -n "$(SELENIUM_BASE_URL)" || (echo "Define SELENIUM_BASE_URL=<url del frontend>" && exit 1)
	set -a && . $(BACKEND_ENV) && set +a && cd backend \
		&& SELENIUM_BASE_URL=$(SELENIUM_BASE_URL) $(MVN) -B -ntp test

# ------------------------------------------------------------------ Calidad --
check-config: ## Valida YAML/compose como lo hace CI (yamllint + compose config)
	@if command -v yamllint >/dev/null 2>&1; then yamllint .; \
	else echo "yamllint no instalado localmente (CI sí lo aplica)"; fi
	$(COMPOSE) config --quiet && echo "docker-compose.yml OK"

clean: ## Limpia artefactos de compilación de Maven
	cd backend && $(MVN) -B -ntp clean
