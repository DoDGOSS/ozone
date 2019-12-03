#!/bin/bash

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

pushd ./ozone-framework-python-server
python setup.py sdist --formats=zip
popd
cp -r ./ozone-framework-python-server/dist/* ./dist

pushd ./docs
docker container rm ozone_docs_builder
docker image rm ozone/docs_builder
docker-compose up --build
docker cp ozone_docs_builder:/documents/build ./build
popd
mkdir ./dist/docs
cp -r ./docs/build/* ./dist/docs

pushd ./dist
#TODO: make the zip name configurable
unzip OWF-8.0.0.0rc2.zip
rm OWF-8.0.0.0rc2.zip
zip -r OWF-8.0.0.0rc2.zip .
