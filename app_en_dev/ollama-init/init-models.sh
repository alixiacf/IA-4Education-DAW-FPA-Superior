#!/bin/sh
set -e

# Check if server is ready
echo "Waiting for Ollama server to be ready..."
while ! curl -s http://localhost:11434/api/version > /dev/null; do
    echo "Waiting for Ollama to start..."
    sleep 1
done
echo "Ollama server is ready!"

# List of models to pull
MODELS=("tinyllama" "gemma2:latest")

# Pull models
for MODEL in "${MODELS[@]}"; do
    echo "Checking if model $MODEL is already downloaded..."
    if ! ollama list | grep -q "$MODEL"; then
        echo "Pulling model $MODEL..."
        ollama pull $MODEL
        echo "Model $MODEL pulled successfully!"
    else
        echo "Model $MODEL is already downloaded."
    fi
done

echo "All models initialized successfully!"