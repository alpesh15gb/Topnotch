#!/bin/sh
set -e

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Run migrations
php artisan migrate --force

# Create storage symlink (public/storage -> storage/app/public)
php artisan storage:link --force 2>/dev/null || true

# Clear and cache config for production
if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Fix storage permissions
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

exec "$@"
