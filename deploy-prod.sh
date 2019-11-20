#!/bin/bash

pushd ./ozone-framework-client/
npm install
npm run bootstrap
npm run clean
npm run build
npm run copy-images

popd
pushd ./ozone-example-widgets/
npm install
npm run clean
npm run build
npm run copy-owf-js

popd
pushd ./ozone-framework-python-server
pip install -r requirements_prod.txt
python manage.py collectstatic --clear --no-input
python manage.py collectstatic --settings=config.settings.production --no-input
python manage.py migrate --settings=config.settings.production --no-input
python manage.py loaddata --settings=config.settings.production resources/fixtures/default_data_production.json
waitress-serve --port=8000 --url-scheme=https config.wsgi:application
