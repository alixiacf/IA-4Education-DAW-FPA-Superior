#!/bin/sh
set -e

echo "=== Iniciando configuración de Ollama ==="

# Verificar red
echo "Verificando configuración de red..."
hostname -i
ip a

# Verificar si el modelo ya está descargado
check_model() {
    local model=$1
    echo "Verificando si el modelo $model ya existe..."
    if ollama list 2>/dev/null | grep -q "$model"; then
        echo "✅ El modelo $model ya está disponible."
        return 0
    else
        echo "❌ El modelo $model no está disponible."
        return 1
    fi
}

# Función para descargar un modelo
download_model() {
    local model=$1
    echo "📥 Descargando modelo $model..."
    
    # Intentar descargar con reintentos
    local max_attempts=3
    local attempt=1
    local success=0
    
    while [ $attempt -le $max_attempts ] && [ $success -eq 0 ]; do
        echo "Intento $attempt de $max_attempts para descargar $model..."
        
        if ollama pull $model; then
            echo "✅ Modelo $model descargado correctamente."
            success=1
        else
            echo "❌ Error al descargar el modelo $model en el intento $attempt."
            if [ $attempt -lt $max_attempts ]; then
                echo "Esperando 5 segundos antes de reintentar..."
                sleep 5
            fi
            attempt=$((attempt + 1))
        fi
    done
    
    if [ $success -eq 0 ]; then
        echo "⚠️ No se pudo descargar el modelo $model después de $max_attempts intentos."
        return 1
    fi
    
    return 0
}

# Asegurar que tenemos al menos un modelo disponible
ensure_models() {
    # Lista de modelos a verificar/descargar, del más pequeño al más grande
    local models="gemma:2b tinyllama:latest llama2:7b"
    local download_success=0
    
    echo "Verificando modelos disponibles..."
    
    # Primero verificar si ya existe algún modelo
    for model in $models; do
        if check_model "$model"; then
            download_success=1
            break
        fi
    done
    
    # Si no hay ningún modelo disponible, intentar descargar
    if [ $download_success -eq 0 ]; then
        echo "No hay modelos disponibles, iniciando descarga..."
        
        # Intentar descargar al menos un modelo de la lista
        for model in $models; do
            echo "Intentando descargar modelo $model..."
            if download_model "$model"; then
                download_success=1
                break
            fi
        done
    fi
    
    if [ $download_success -eq 0 ]; then
        echo "⚠️ No se pudo descargar ningún modelo. El servidor se iniciará, pero no podrá generar respuestas."
    else
        echo "✅ Al menos un modelo está disponible o se está descargando."
    fi
}

# Crear directorio para modelos si no existe
if [ ! -d "/root/.ollama" ]; then
    echo "Creando directorio para modelos..."
    mkdir -p /root/.ollama
    chmod 755 /root/.ollama
fi

# Iniciar la descarga de modelos
ensure_models

# Verificar que el servicio pueda escuchar en el puerto
echo "Verificando puerto 11434..."
if netstat -tuln | grep -q ":11434"; then
    echo "⚠️ El puerto 11434 ya está en uso. Esto podría causar problemas."
else
    echo "✅ Puerto 11434 disponible."
fi

# Iniciar el servidor Ollama
echo "🚀 Iniciando servidor Ollama..."
exec ollama serve