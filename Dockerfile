FROM php:8.2-cli

# Cài các extension PHP cần thiết
RUN apt-get update && apt-get install -y \
    curl \
    zip \
    unzip \
    git \
    sqlite3 \
    libsqlite3-dev \
    nodejs \
    npm \
    && docker-php-ext-install pdo pdo_sqlite \
    && apt-get clean

# Cài Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Thư mục làm việc
WORKDIR /var/www

# Copy toàn bộ source code
COPY . .

# Cài PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Cài Node dependencies và build frontend
RUN npm install --legacy-peer-deps && npm run build

# Tạo file .env từ .env.example nếu chưa có
RUN cp -n .env.example .env || true

# Cấu hình .env cho Docker
RUN sed -i 's|APP_URL=.*|APP_URL=http://localhost:8000|g' .env
RUN sed -i 's|DB_CONNECTION=.*|DB_CONNECTION=sqlite|g' .env
RUN sed -i 's|SESSION_DRIVER=.*|SESSION_DRIVER=file|g' .env
RUN sed -i 's|CACHE_STORE=.*|CACHE_STORE=file|g' .env
RUN sed -i 's|QUEUE_CONNECTION=.*|QUEUE_CONNECTION=sync|g' .env

# Tạo file SQLite nếu chưa có
RUN touch database/database.sqlite

# Generate app key
RUN php artisan key:generate

# Chạy migration
RUN php artisan migrate --force

# Tạo storage link
RUN php artisan storage:link || true

# Phân quyền thư mục storage
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
