#!/bin/ash

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."
    while ! nc -z $AUTHENTICATION_DB_HOST $DB_PORT; do
        sleep 1
    done

    echo "PostgreSQL started"
    python manage.py makemigrations
    python manage.py migrate

    echo "Initializing data"
    python manage.py init_data

    echo "Running collectstatic"
    python manage.py collectstatic --noinput

    echo "Create super user"
    python manage.py create_super_user --no_input

    if [ "$DEBUG" = "True" ]; then
        echo "Dev"
        python manage.py runserver 0.0.0.0:8000
    else
        echo "Prod"
        gunicorn backend.wsgi:application --bind 0.0.0.0:8000
    fi

  
fi

exec "$@"