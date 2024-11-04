#!/bin/bash

# Install dependencies
npm install

# Build the project
npm run build --name=admin-panel

# Create a Dockerfile for the build
cat <<EOF > Dockerfile
# Use the official NGINX image from the Docker Hub
FROM nginx:alpine

# Copy the build output to the NGINX html directory
COPY ./dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]
EOF

# build Docker
docker build --build-arg VITE_REGISTRY_URL=http://192.168.1.6:3000 -t admin-panel .

# start
docker run -d --name admin-panel --rm --network nginx-proxy_default admin-panel
