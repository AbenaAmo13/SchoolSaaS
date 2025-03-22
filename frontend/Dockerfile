# Use a minimal Node.js base image for security and smaller footprint
FROM node:18-alpine AS builder

# Set environment variables for better performance and security
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_PRODUCTION=true

# Set the working directory
WORKDIR /app

# Use a separate, non-root user for security
RUN adduser -D appuser && chown -R appuser /app

# Copy application files (excluding files from .dockerignore)
COPY . .

# Install dependencies using a clean npm cache to minimize image size
RUN npm ci --omit=dev && npm cache clean --force

# Switch to the non-root user
USER appuser

# Expose only necessary ports
EXPOSE 3000

# Start the application
CMD ["npm", "start"]