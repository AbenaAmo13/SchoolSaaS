# Stage 1: Builder stage for dependencies
FROM python:3.13.2-alpine AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 


# Set environment variables and working directory

WORKDIR /usr/src/auth-app

COPY requirements.txt /usr/src/auth-app/
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final Production Image
FROM python:3.13.2-alpine

# Create non-root user with `adduser` (Alpine style)
#Don't use root as the user, that is a vulnerability. 
RUN adduser -D -u 1000 appuser 

WORKDIR /usr/src/auth-app


COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

COPY --chown=appuser:appuser . .


# Give appuser ownership of the static and media directories
RUN mkdir -p /usr/src/auth-app/staticfiles /usr/src/auth-app/media \
    && chown -R appuser:appuser /usr/src/auth-app/staticfiles /usr/src/auth-app/media

# Ensure the entrypoint script is executable
RUN chmod +x /usr/src/auth-app/scripts/dev.entrypoint.sh

USER appuser

EXPOSE 8000 

# Use the correct path for ENTRYPOINT
ENTRYPOINT ["./scripts/dev.entrypoint.sh"]