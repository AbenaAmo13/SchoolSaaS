#!/bin/bash

# Script to run migrations for both Django services
# Usage: ./scripts/migrate.sh [service_name]
# If no service name is provided, runs migrations for both services

SERVICE_NAME=${1:-"both"}

echo "Running migrations for: $SERVICE_NAME"

case $SERVICE_NAME in
    "backend"|"auth")
        echo "Running migrations for authentication backend..."
        docker-compose exec django_authentication_backend python manage.py makemigrations
        docker-compose exec django_authentication_backend python manage.py migrate
        ;;
    "school"|"sm")
        echo "Running migrations for school management service..."
        docker-compose exec school_management_service python manage.py makemigrations
        docker-compose exec school_management_service python manage.py migrate
        ;;
    "both"|"all")
        echo "Running migrations for both services..."
        echo "Authentication backend:"
        docker-compose exec django_authentication_backend python manage.py makemigrations
        docker-compose exec django_authentication_backend python manage.py migrate
        echo "School management service:"
        docker-compose exec school_management_service python manage.py makemigrations
        docker-compose exec school_management_service python manage.py migrate
        ;;
    *)
        echo "Usage: $0 [backend|school|both]"
        echo "  backend - Run migrations for authentication backend only"
        echo "  school  - Run migrations for school management service only"
        echo "  both    - Run migrations for both services (default)"
        exit 1
        ;;
esac

echo "Migrations completed!" 