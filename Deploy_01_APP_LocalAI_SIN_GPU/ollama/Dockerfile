FROM ollama/ollama

WORKDIR /app
# Instalar curl
RUN apt-get update && apt-get install -y curl
# Copiar el script `run.sh` dentro del contenedor
COPY run.sh /app/run.sh


# Dar permisos de ejecución al script
RUN chmod +x /app/run.sh

CMD ["/bin/sh", "/app/run.sh"]
