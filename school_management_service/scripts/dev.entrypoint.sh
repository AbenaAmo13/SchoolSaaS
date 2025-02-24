#!/bin/sh
 echo "$DATABASE"
if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SCHOOL_MANAGEMENT_DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
    python manage.py makemigrations
    python manage.py migrate

    python manage.py collectstatic --noinput
    if [ "$DEBUG" = "True" ]
    then
        python manage.py runserver 0.0.0.0:8001 
    else
        gunicorn school_management_service.wsgi:application --bind 0.0.0.0:8001
    fi

fi


exec "$@"
