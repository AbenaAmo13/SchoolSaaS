# Use the official Python runtime image
FROM python:3.12-slim

 
# Create the app directory
RUN mkdir /app
 
# Set the working directory inside the container
WORKDIR /app
 
# Set environment variables 
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1 
 
# Upgrade pip
RUN pip install --upgrade pip 
 
# Copy the Django project  and install dependencies
COPY requirements.txt  /app/
 
# run this command to install all dependencies 
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*


# copy entrypoint.sh
COPY ./scripts/dev.entrypoint.sh .
RUN sed -i 's/\r$//g' /app/dev.entrypoint.sh
RUN chmod +x /app/dev.entrypoint.sh

 
# Copy the Django project to the container
COPY . /app/
 
# Expose the Django port
EXPOSE 8001
 
ENTRYPOINT ["/app/dev.entrypoint.sh"]
