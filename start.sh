#!/bin/bash

pushd ./ozone-framework-client/
npm install
npm run bootstrap
npm run clean
npm run build
npm run copy-required-public

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
python manage.py collectstatic --settings=config.settings.local --no-input
python manage.py migrate --settings=config.settings.local --no-input
python manage.py loaddata --settings=config.settings.local resources/fixtures/default_data_production.json
waitress-serve --port=8000 --url-scheme=http config.wsgi:application
