#!/usr/bin/env bash

# This script redeploys Ozone's Frontend/Backend as well as the example widgets.
# If you do not wish to deploy the example widgets, remove ozone_widgets below. 

# Command line arguments
BUILD_OPTS=""

while [ $# -gt 0 ] ; do
    case "$1" in
        --no-cache) BUILD_OPTS="$BUILD_OPTS --no-cache" ;;
    esac
    shift
done


echo "Stopping container..."
docker-compose rm -fs ozone_server ozone_widgets

echo "Building container..."
docker-compose build ${BUILD_OPTS} ozone_server ozone_widgets

echo "Starting container..."
docker-compose up ozone_server ozone_widgets 
