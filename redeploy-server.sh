#!/usr/bin/env bash

# Command line arguments
REMOVE_VOLUMES=false

while [ $# -gt 0 ] ; do
    case "$1" in
        --flush) REMOVE_VOLUMES=true ;;
    esac
    shift
done


echo "Stopping container..."
docker-compose rm -fs ozone_server

if [ "$REMOVE_VOLUMES" = true ] ; then
    echo "Clearing volumes..."
    docker volume rm ozone_server_m2_cache
    docker volume rm ozone_server_gradle_cache
fi

echo "Starting container..."
docker-compose up ozone_server


