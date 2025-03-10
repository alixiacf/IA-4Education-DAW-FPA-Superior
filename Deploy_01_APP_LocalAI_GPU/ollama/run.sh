#!/bin/sh
echo "🚀 Iniciando Ollama..."

# Espera hasta que Ollama esté listo
until ollama serve &>/dev/null; do
  echo "🔄 Esperando que Ollama se inicie..."
  sleep 2
done

echo "✔️ Ollama está activo. Descargando modelo..."
ollama pull gemma2:latest  
echo "✔️ Modelo descargado. Listo para usar."

# Mantener activo el contenedor
tail -f /dev/null