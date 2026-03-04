#!/bin/bash
set -e

echo "=== TopNotch Production Deploy ==="

# 1. Copy backend env if not exists
if [ ! -f backend/.env ]; then
    echo "[1/5] Creating backend/.env from example..."
    cp backend/.env.example backend/.env
    # Generate app key
    docker run --rm -v "$(pwd)/backend:/var/www" \
        php:8.3-fpm-alpine sh -c "cd /var/www && php artisan key:generate --force" 2>/dev/null || true
    echo "  !! Edit backend/.env and set DB_PASSWORD, APP_KEY before continuing"
    exit 1
fi

echo "[1/5] backend/.env exists"

# 2. Build images
echo "[2/5] Building Docker images..."
docker compose build --no-cache

# 3. Start services
echo "[3/5] Starting services..."
docker compose up -d

# 4. Wait for health
echo "[4/5] Waiting for services to be healthy..."
sleep 10

# 5. Install host nginx config
echo "[5/5] Deploy nginx config..."
if [ -d /etc/nginx/sites-available ]; then
    sudo cp nginx/topnotch.apextime.in.conf /etc/nginx/sites-available/topnotch.apextime.in
    sudo ln -sf /etc/nginx/sites-available/topnotch.apextime.in /etc/nginx/sites-enabled/topnotch.apextime.in
    sudo nginx -t && sudo systemctl reload nginx
    echo "  Host nginx configured."
    echo ""
    echo "  Next: get SSL cert with:"
    echo "    sudo certbot --nginx -d topnotch.apextime.in"
else
    echo "  Skipping host nginx (not a Linux server?)"
    echo "  Manually copy nginx/topnotch.apextime.in.conf to your nginx sites-available"
fi

echo ""
echo "=== Deploy complete! ==="
echo "App running at: https://topnotch.apextime.in"
