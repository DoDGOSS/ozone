#!/usr/bin/env bash

# Command line arguments
BUILD_OPTS=""

while [ $# -gt 0 ] ; do
    case "$1" in
        --no-cache) BUILD_OPTS="$BUILD_OPTS --no-cache" ;;
    esac
    shift
done


echo "Stopping container..."
docker-compose rm -fs ozone_server

echo "Building container..."
docker-compose build ${BUILD_OPTS} ozone_server

echo "Starting container..."
docker-compose up ozone_server
