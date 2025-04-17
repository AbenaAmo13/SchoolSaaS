# Use a minimal Node.js base image for security and smaller footprint
FROM node:18-alpine AS builder
# Set the working directory
WORKDIR /app
# Use a separate, non-root user for security
RUN adduser -D appuser && chown -R appuser /app
COPY package.json ./
RUN npm install
# Copy application files (excluding files from .dockerignore)
COPY . .
# Expose only necessary ports
EXPOSE 5173
ENV PATH /app/node_modules/.bin:$PATH
# Start the application
CMD ["npm", "run", "dev"]