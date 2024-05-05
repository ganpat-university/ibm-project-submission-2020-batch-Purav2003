# Use an official Python runtime as a parent image
FROM python:3.11

# Set environment variables for Python to run in unbuffered mode and disable Python bytecode writing
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container at /app
COPY requirements.txt /app/

# RUN useradd -m purav && echo "purav ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# USER purav

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY myproject /app/

# Create a virtual environment and activate it
# RUN python -m venv virt
# ENV PATH="/app/virt/bin:$PATH"

# Activate virtual environment and collect static files
RUN python manage.py

EXPOSE 80

CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]  