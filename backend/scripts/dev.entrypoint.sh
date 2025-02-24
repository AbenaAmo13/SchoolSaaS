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
     echo "$DEBUG is here"

    if [ "$DEBUG" = "True" ]
    then
      python manage.py runserver 0.0.0.0:8000
    else
      gunicorn backend.wsgi:application --bind 0.0.0.0:8000
      
    fi


    if [ "$DJANGO_SUPERUSER_USERNAME" ]
    then
        python manage.py createsuperuser \
            --noinput \
            --username $DJANGO_SUPERUSER_USERNAME \
            --email $DJANGO_SUPERUSER_EMAIL
    fi

fi


exec "$@"
