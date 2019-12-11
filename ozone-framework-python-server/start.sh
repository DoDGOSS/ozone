#!/bin/bash

# Start script for bundled application. Run ./build.sh first

pip install -r requirements_prod.txt
python manage.py migrate --settings=config.settings.production --no-input
python manage.py loaddata --settings=config.settings.production resources/fixtures/default_data_production.json
waitress-serve --port=8000 --url-scheme=http config.wsgi:application