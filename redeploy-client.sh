#!/usr/bin/env bash

# Command line arguments
FLUSH_NODE_MODULES=false

while [ $# -gt 0 ] ; do
    case "$1" in
        --flush) FLUSH_NODE_MODULES=true ;;
    esac
    shift
done


echo "Stopping container..."
docker-compose rm -fs ozone_client

if [ "$FLUSH_NODE_MODULES" = true ] ; then
    echo "Clearing node_modules volume..."
    docker volume rm ozone_client_node_modules
fi

echo "Starting container..."
docker-compose up ozone_client


