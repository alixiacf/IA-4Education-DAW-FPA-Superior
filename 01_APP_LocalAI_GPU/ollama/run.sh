#!/bin/sh
echo "🚀 Iniciando Ollama..."
ollama serve &  # ⚠️ Ejecutamos en segundo plano

echo "🔄 Esperando a que Ollama esté listo..."
while ! curl -s http://localhost:11434/ > /dev/null; do
  sleep 2
done

echo "✅ Ollama está listo. Descargando modelo..."
ollama pull gemma2:latest  
echo "✔️ Modelo descargado. Listo para usar."

# Mantener el contenedor activo
tail -f /dev/null
