.PHONY: up down restart build prod-up prod-build migrate seed fresh shell logs ps

# Start all containers
up:
	docker-compose up -d

# Stop all containers
down:
	docker-compose down

# Restart all containers
restart:
	docker-compose restart

# Build/rebuild containers
build:
	docker-compose build --no-cache

# Run migrations
migrate:
	docker-compose exec app php artisan migrate --force

# Run seeders
seed:
	docker-compose exec app php artisan db:seed --force

# Fresh migration + seed
fresh:
	docker-compose exec app php artisan migrate:fresh --seed --force

# Shell into app container
shell:
	docker-compose exec app bash

# View logs
logs:
	docker-compose logs -f

# Container status
ps:
	docker-compose ps

# Install backend dependencies
composer:
	docker-compose exec app composer install

# Install frontend dependencies
npm:
	docker-compose exec web npm install

# Run artisan commands: make artisan cmd="migrate:status"
artisan:
	docker-compose exec app php artisan $(cmd)

# Clear all caches
cache-clear:
	docker-compose exec app php artisan cache:clear
	docker-compose exec app php artisan config:clear
	docker-compose exec app php artisan route:clear
	docker-compose exec app php artisan view:clear

# Queue work
queue:
	docker-compose exec app php artisan queue:work

# Copy env file
env:
	cp backend/.env.example backend/.env

# Production: build without override (no bind mounts, production images)
prod-build:
	docker compose -f docker-compose.yml build --no-cache

# Production: start without override
prod-up:
	docker compose -f docker-compose.yml up -d

prod-down:
	docker compose -f docker-compose.yml down

# Fast deploy: only rebuild frontend (Next.js) — use after frontend-only changes
deploy-frontend:
	git pull origin master
	docker compose -f docker-compose.yml build web
	docker compose -f docker-compose.yml up -d --no-deps web

# Fast deploy: only rebuild backend (Laravel) — use after backend-only changes
deploy-backend:
	git pull origin master
	docker compose -f docker-compose.yml build app worker scheduler
	docker compose -f docker-compose.yml up -d --no-deps app worker scheduler

# Full deploy with cache (faster than prod-build, rebuilds all)
deploy:
	git pull origin master
	docker compose -f docker-compose.yml build
	docker compose -f docker-compose.yml up -d
