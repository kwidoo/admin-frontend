# Use the official NGINX image from the Docker Hub
FROM nginx:alpine

# Copy the build output to the NGINX html directory
COPY ./dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]
