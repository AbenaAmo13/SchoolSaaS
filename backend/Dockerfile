# Use a minimal Python image
FROM python:3.12-slim

# Set environment variables and working directory
ENV HOME=/usr/src/auth-app
WORKDIR $HOME

# Prevent Python from writing .pyc files and buffer logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies in one step to keep image small
RUN apt-get update && apt-get install -y netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project
COPY . .

# Ensure the entrypoint script is executable
RUN chmod +x ./scripts/dev.entrypoint.sh

# Expose the port
EXPOSE 8000

# Use the correct path for ENTRYPOINT
ENTRYPOINT ["./scripts/dev.entrypoint.sh"]
