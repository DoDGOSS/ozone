#!/bin/bash

# requires unzip and zip

rm -rf ./ozone-framework-client/packages/application/build
rm -rf ./docs/build

pushd ./ozone-framework-python-server
python setup.py clean
popd

pushd ./ozone-framework-client/
npm install
npm run bootstrap
npm run clean
npm run build
npm run copy-required-public
popd
cp -r ./ozone-framework-client/packages/application/build/. ./ozone-framework-python-server/config/staticfiles
cp ./ozone-framework-client/packages/application/webpack-stats.json ./ozone-framework-python-server/config/webpack-stats.json

pushd ./ozone-example-widgets/
npm install
npm run clean
npm run build
npm run copy-owf-js
popd
cp -r ./ozone-example-widgets/build/. ./ozone-framework-python-server/config/staticfiles

pushd ./ozone-framework-python-server
python setup.py sdist --formats=zip
popd
mkdir ./dist
cp -r ./ozone-framework-python-server/dist/. ./dist

pushd ./docs/src
docker container rm ozone_docs_builder
docker image rm ozone/docs_builder
docker-compose up --build
docker cp ozone_docs_builder:/documents/build ../build
popd
mkdir ./dist/ozone-documentation
cp -r ./docs/build/*.pdf ./dist/ozone-documentation

# TODO: make the zip name configurable
pushd ./dist/
rm -rf OZONE-v8.0.0.0-GA
unzip OZONE-v8.0.0.0-GA.zip

# Copy required files
mv ./ozone-documentation ./OZONE-v8.0.0.0-GA/ozone-documentation
cp ../aml_ozone_patch.zip ../esri-1.4.31.war ../RELEASE-NOTES.md ../LICENSE OZONE-v8.0.0.0-GA/
cp ../ozone-framework-python-server/.env  OZONE-v8.0.0.0-GA/
# TODO: Add docker files if built in different node environment
cp ../ozone-framework-python-server/bundle_config/*  OZONE-v8.0.0.0-GA/

# Modify .env file for bundle
# TODO: improve to not be hardcoded
pushd OZONE-v8.0.0.0-GA
sed 's/django.db.backends.postgresql/django.db.backends.sqlite3/g' -i .env
sed 's/OWF_DB_NAME=postgres/OWF_DB_NAME=owf_db/g' -i .env
popd

# Clean up and re-zip
rm OZONE-v8.0.0.0-GA.zip

# Note requires zip installed - this step may require someone to manually zip folder if this package is not installed
zip -r OZONE-v8.0.0.0-GA.zip .
