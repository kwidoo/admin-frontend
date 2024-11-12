#!/bin/bash
# build Docker
docker build -t admin-panel .

# start
docker run -d --name admin-panel --rm --network nginx-proxy_default admin-panel
