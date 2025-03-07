FROM ollama/ollama:latest

# Instalar herramientas para depuración y diagnóstico
RUN apt-get update && \
    apt-get install -y curl iputils-ping net-tools procps && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Crear directorio para modelos
RUN mkdir -p /root/.ollama

# Copiar el script de inicialización
COPY pull-models.sh /usr/local/bin/pull-models.sh
RUN chmod +x /usr/local/bin/pull-models.sh

# Ejecutar el script de inicialización al arrancar el contenedor
CMD ["/usr/local/bin/pull-models.sh"]