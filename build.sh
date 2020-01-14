#!/bin/bash

# TODO - Add widgets

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
popd
cp -r ./ozone-framework-client/packages/application/build ./ozone-framework-python-server/config/staticfiles
cp ./ozone-framework-client/packages/application/webpack-stats.json ./ozone-framework-python-server/config/webpack-stats.json

pushd ./ozone-framework-python-server
python setup.py sdist --formats=zip
popd
mkdir ./dist
cp -r ./ozone-framework-python-server/dist/* ./dist

pushd ./docs/src
docker container rm ozone_docs_builder
docker image rm ozone/docs_builder
docker-compose up --build
docker cp ozone_docs_builder:/documents/build ../build
popd
mkdir ./dist/docs
cp -r ./docs/build/* ./dist/docs

pushd ./dist
#TODO: make the zip name configurable
#unzip OZONE-8.0.0.0ga.zip
#rm OZONE-8.0.0.0ga.zip
#zip -r OZONE-8.0.0.0ga.zip .
