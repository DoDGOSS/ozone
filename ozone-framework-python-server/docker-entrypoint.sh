#!/bin/bash

# Collect static files
# echo "Collect static files"
# python manage.py collectstatic --noinput

# Apply database migrations
echo "Apply database migrations"
until python manage.py migrate --no-input; do
  >&2 echo "db is unvailable - retrying"
  sleep 5
done

# Load fixture data
echo "Load default users"
python manage.py loaddata default_users

# Start server
echo "Starting server"
python manage.py runserver 0.0.0.0:8000
