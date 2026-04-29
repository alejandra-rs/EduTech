# Usamos una versión ligera de Python
FROM python:3.12-slim

# Evita que Python cree archivos .pyc y fuerza a que la consola se actualice en tiempo real
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Creamos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos las dependencias primero (para aprovechar el caché de Docker)
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código
COPY . /app/backend/

ENV PYTHONPATH=/app