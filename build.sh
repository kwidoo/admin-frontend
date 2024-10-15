#!/bin/bash

# Export the environment variables
export VITE_APP_ENVIRONMENT=stage
export VITE_APP_DELIVERY_API_URL

# Install dependencies
npm install

# Build the project
npm run build

# Create a Dockerfile for the build
cat <<EOF > Dockerfile
# Use the official NGINX image from the Docker Hub
FROM nginx:alpine

# Copy the build output to the NGINX html directory
COPY ./build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]
EOF
