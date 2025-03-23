# Stage 1: Builder stage for dependencies
FROM python:3.13.2-alpine AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

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

# Ensure the entrypoint script is executable
RUN chmod +x ./scripts/dev.entrypoint.sh

#USER appuser

EXPOSE 8000 

# Use the correct path for ENTRYPOINT
ENTRYPOINT ["./scripts/dev.entrypoint.sh"]