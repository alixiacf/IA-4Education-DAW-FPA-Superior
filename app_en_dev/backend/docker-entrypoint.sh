#!/bin/sh
set -e

echo "Starting backend initialization..."

# Wait for Ollama to be available
echo "Checking if Ollama is available..."
OLLAMA_READY=false
MAX_RETRIES=30
COUNT=0

while [ $COUNT -lt $MAX_RETRIES ]; do
    if curl -s "${OLLAMA_URL}/api/version" > /dev/null; then
        echo "✅ Ollama is available!"
        OLLAMA_READY=true
        break
    else
        echo "Ollama not ready yet. Retrying in 2 seconds..."
        sleep 2
        COUNT=$((COUNT + 1))
    fi
done

if [ "$OLLAMA_READY" = false ]; then
    echo "⚠️ Warning: Ollama is not available after $MAX_RETRIES retries."
    echo "The application will still start, but might not function correctly."
else
    # Check if there are any models available
    echo "Checking for available models..."
    MODELS_RESPONSE=$(curl -s "${OLLAMA_URL}/api/tags")
    
    if [ "$(echo "$MODELS_RESPONSE" | grep -c "models")" -gt 0 ]; then
        echo "✅ Models are available in Ollama:"
        echo "$MODELS_RESPONSE" | grep -o '"name":"[^"]*"' | cut -d'"' -f4
    else
        echo "⚠️ Warning: No models found in Ollama."
        echo "Please run the pull-models.sh script to download models:"
        echo "  ./pull-models.sh"
        echo ""
        echo "The application will still start but won't function until models are available."
    fi
fi

# Wait for ChromaDB to be available
echo "Checking if ChromaDB is available..."
CHROMA_READY=false
COUNT=0

while [ $COUNT -lt $MAX_RETRIES ]; do
    if curl -s "${CHROMA_URL}/api/v1/heartbeat" > /dev/null; then
        echo "✅ ChromaDB is available!"
        CHROMA_READY=true
        break
    else
        echo "ChromaDB not ready yet. Retrying in 2 seconds..."
        sleep 2
        COUNT=$((COUNT + 1))
    fi
done

if [ "$CHROMA_READY" = false ]; then
    echo "⚠️ Warning: ChromaDB is not available after $MAX_RETRIES retries."
    echo "The application will still start, but might not function correctly."
fi

echo "Backend initialization complete."
echo "Starting server..."
echo "============================================================"

# Pass execution to the CMD
exec "$@"