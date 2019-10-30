#!/bin/bash

echo "Running PEP8 checks"
echo "See pep8-results.txt for list of errors."
pycodestyle --max-line-length=120 --show-source --show-pep8 --count --exclude="*/migrations, ./migration_owf, ./migration_tool" . > pep8-results.txt
# autopep8 --max-line-length=120 --in-place --recursive --aggressive owf_framework


# Collect static files
# echo "Collect static files"
# python manage.py collectstatic --noinput

# Apply database migrations
echo "Apply database migrations"
until python manage.py migrate --no-input; do
  >&2 echo "db is unavailable - retrying"
  sleep 5
done

# Load fixture data
echo "Load fixture data"
python manage.py loaddata resources/fixtures/default_data.json

# Start server
echo "Starting server"
python man