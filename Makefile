# =====================================================================
#  YourParking - Community Edition | Makefile
#  Automatiza el ciclo de vida del stack docker compose.
#
#  Uso rápido:
#    make up              levanta todo el stack
#    make up SVC=backend  levanta solo un servicio
#    make logs SVC=db     sigue los logs de un servicio
#    make restart         reinicia los contenedores
#    make down            detiene el stack (conserva los datos)
#    make clean           detiene y elimina los volúmenes (¡pierde datos!)
# =====================================================================

SHELL := /bin/bash

# Archivo compose por defecto. Puede sobrescribirse:
#   make COMPOSE=metrics/docker-compose.yml up
COMPOSE ?= docker-compose.yml

# Variables de entorno opcionales en la raíz del repo (".env").
# Si no existe, se usan los valores por defecto del compose (stack local).
ENV_FILE ?= .env

COMPOSE_CMD := docker compose -f $(COMPOSE)
ifeq ($(wildcard $(ENV_FILE)),$(ENV_FILE))
COMPOSE_CMD += --env-file $(ENV_FILE)
endif

# Servicio objetivo para comandos parciales.
#   make up SVC=backend | make logs SVC=db | make restart SVC=grafana
SVC ?=

.PHONY: help build pull up down stop start restart ps status logs \
        clean prune db-shell backend-shell frontend-shell \
        up-metrics down-metrics logs-metrics

help: ## Muestra esta ayuda
	@echo "YourParking - Comandos disponibles:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Variables útiles:"
	@echo "  SVC      = servicio (backend, frontend, db, prometheus, grafana)"
	@echo "  COMPOSE  = archivo compose (default: docker-compose.yml)"
	@echo "  ENV_FILE = archivo de variables (default: .env en la raíz)"
	@echo ""
	@echo "Ejemplos:"
	@echo "  make up | make up SVC=backend | make logs SVC=db | make up-metrics"

build: ## Construye (o reconstruye) las imágenes
	$(COMPOSE_CMD) build $(SVC)

pull: ## Descarga las imágenes base
	$(COMPOSE_CMD) pull

up: ## Levanta el stack (o solo SVC) en segundo plano
	$(COMPOSE_CMD) up -d $(SVC)

down: ## Detiene los contenedores (conserva los volúmenes de datos)
	$(COMPOSE_CMD) down

stop: ## Detiene los contenedores sin eliminarlos
	$(COMPOSE_CMD) stop $(SVC)

start: ## Arranca los contenedores detenidos
	$(COMPOSE_CMD) start $(SVC)

restart: ## Reinicia los contenedores (o solo SVC)
	$(COMPOSE_CMD) restart $(SVC)

ps: status ## Muestra el estado de los contenedores
status: ## Muestra el estado de los contenedores
	$(COMPOSE_CMD) ps

logs: ## Logs en vivo (filtra con SVC, p. ej. make logs SVC=backend)
	$(COMPOSE_CMD) logs -f --tail=100 $(SVC)

clean: ## Detiene el stack y ELIMINA los volúmenes de datos (¡no recuperable!)
	$(COMPOSE_CMD) down -v --remove-orphans

prune: clean ## Alias de clean

db-shell: ## Abre psql dentro del contenedor de la base de datos
	$(COMPOSE_CMD) exec db psql -U $${POSTGRES_USER:-parking} -d $${POSTGRES_DB:-parking_management}

backend-shell: ## Abre una shell dentro del contenedor del backend
	$(COMPOSE_CMD) exec backend /bin/bash

frontend-shell: ## Abre una shell dentro del contenedor del frontend
	$(COMPOSE_CMD) exec frontend /bin/sh

# ---------------------------------------------------------------
# Stack de métricas standalone (solo Prometheus + Grafana),
# pensado para monitorear un backend que corre fuera de contenedores.
# ---------------------------------------------------------------
COMPOSE_METRICS ?= metrics/docker-compose.yml
METRICS_CMD := docker compose -f $(COMPOSE_METRICS)

up-metrics: ## Levanta solo Prometheus + Grafana
	$(METRICS_CMD) up -d

down-metrics: ## Detiene Prometheus + Grafana
	$(METRICS_CMD) down

logs-metrics: ## Logs en vivo de Prometheus y Grafana
	$(METRICS_CMD) logs -f --tail=100