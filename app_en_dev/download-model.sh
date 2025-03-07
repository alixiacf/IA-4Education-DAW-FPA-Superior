#!/bin/bash
# Script para descargar modelos en Ollama

echo "===== Descargando modelo para Ollama ====="

# Verificar si el contenedor de Ollama está ejecutándose
if ! docker ps | grep -q ollama; then
  echo "El contenedor de Ollama no está ejecutándose."
  echo "Ejecuta primero 'docker-compose up -d' para iniciar los contenedores."
  exit 1
fi

# Definir modelos a probar
MODELS=("llama2" "gemma:2b" "tinyllama:latest")

# Verificar modelos disponibles
echo "Verificando modelos existentes..."
CURRENT_MODELS=$(docker exec ollama ollama list 2>/dev/null)
echo "Modelos disponibles actualmente:"
echo "$CURRENT_MODELS"

# Si ya hay modelos, preguntar si quiere descargar otro
if [ -n "$CURRENT_MODELS" ]; then
  echo ""
  echo "Ya tienes modelos descargados."
  read -p "¿Quieres descargar otro modelo? (s/n): " DOWNLOAD_MORE
  if [ "$DOWNLOAD_MORE" != "s" ]; then
    echo "No se descargará ningún modelo adicional."
    exit 0
  fi
fi

# Preguntar qué modelo descargar
echo ""
echo "Modelos disponibles para descargar:"
select MODEL in "${MODELS[@]}" "Otro (especificar)" "Cancelar"; do
  if [ "$REPLY" -eq "${#MODELS[@]}" ]; then
    # Opción "Otro"
    read -p "Ingresa el nombre del modelo a descargar: " CUSTOM_MODEL
    MODEL=$CUSTOM_MODEL
    break
  elif [ "$REPLY" -eq "$((${#MODELS[@]}+1))" ]; then
    # Opción "Cancelar"
    echo "Operación cancelada."
    exit 0
  elif [ -n "$MODEL" ]; then
    break
  else
    echo "Opción inválida. Intenta de nuevo."
  fi
done

# Confirmar descarga
echo ""
echo "Se descargará el modelo: $MODEL"
read -p "¿Confirmar? (s/n): " CONFIRM
if [ "$CONFIRM" != "s" ]; then
  echo "Descarga cancelada."
  exit 0
fi

# Descargar el modelo
echo ""
echo "Descargando modelo $MODEL..."
docker exec ollama ollama pull $MODEL

# Verificar si la descarga fue exitosa
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Modelo $MODEL descargado exitosamente."
  echo "Modelos disponibles ahora:"
  docker exec ollama ollama list
else
  echo ""
  echo "❌ Error al descargar el modelo $MODEL."
  echo "Verifica el nombre del modelo y la conexión a internet."
  exit 1
fi

# Finalizar
echo ""
echo "El modelo está listo para ser utilizado en la aplicación."
echo "Recarga la página web para ver el modelo en la lista de modelos disponibles."