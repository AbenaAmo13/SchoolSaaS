# Stage 1: Builder stage for dependencies
FROM python:3.13.2-alpine AS builder

#ENV PYTHONDONTWRITEBYTECODE=1
#ENV PYTHONUNBUFFERED=1 

WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final Production Image
FROM python:3.13.2-alpine

# Create non-root user with `adduser` (Alpine style)
#Don't use root as the user, that is a vulnerability. 
RUN adduser -D -u 1000 appuser 

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

COPY --chown=appuser:appuser . .

# Give appuser ownership of the static and media directories
RUN mkdir -p /app/staticfiles /app/media \
    && chown -R appuser:appuser /app/staticfiles /app/media

# Switch to non-root user
USER appuser

# Ensure the entrypoint script is executable
RUN chmod +x ./scripts/dev.entrypoint.sh

EXPOSE 8001

ENTRYPOINT ["./scripts/dev.entrypoint.sh"]
