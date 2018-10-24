#!/usr/bin/env bash

docker-compose rm -fs ozone_server
docker-compose build ozone_server
docker-compose up ozone_server
