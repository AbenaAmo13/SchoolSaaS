#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $AUTHENTICATION_DB_HOST $DB_PORT; do
        sleep 0.1
    done

    echo "PostgreSQL started"
    python manage.py makemigrations
    python manage.py migrate

    python manage.py collectstatic --noinput
    #python manage.py runserver 0.0.0.0:8000
    if [ "$DEBUG" = "True" ]
    then
        python manage.py runserver 0.0.0.0:8000;
    else
        gunicorn backend.wsgi:application --bind 0.0.0.0:8000;
    fi

    python manage.py createsuperuser --noinput;
fi
