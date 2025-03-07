#!/bin/bash
# Script para depurar problemas de conexión entre contenedores

echo "====== DEPURACIÓN DE CONEXIÓN ENTRE SERVICIOS ======"

echo -e "\n\n==== VERIFICANDO CONTENEDORES EN EJECUCIÓN ===="
docker ps

echo -e "\n\n==== LOGS DEL CONTENEDOR BACKEND ===="
docker logs backend

echo -e "\n\n==== LOGS DEL CONTENEDOR CHROMA ===="
docker logs chroma | tail -n 40

echo -e "\n\n==== LOGS DEL CONTENEDOR OLLAMA ===="
docker logs ollama | tail -n 40

echo -e "\n\n==== PROBANDO PING DESDE BACKEND A CHROMA ===="
docker exec backend ping -c 4 chroma

echo -e "\n\n==== PROBANDO PING DESDE BACKEND A OLLAMA ===="
docker exec backend ping -c 4 ollama

echo -e "\n\n==== VERIFICANDO RED DE DOCKER ===="
docker network inspect bridge

echo -e "\n\n==== VERIFICANDO ENDPOINT DE SALUD DE CHROMA ===="
docker exec backend curl -v http://chroma:8000/api/v1/heartbeat

echo -e "\n\n==== VERIFICANDO ENDPOINT DE SALUD DE OLLAMA ===="
docker exec backend curl -v http://ollama:11434/api/version

echo -e "\n\n==== VERIFICANDO CONFIGURACIÓN DE CHROMA EN BACKEND ===="
docker exec backend cat /app/server.js | grep -A 5 "ChromaClient"

echo -e "\n\n==== VERIFICANDO ENDPOINT DE SALUD DE BACKEND ===="
curl -v http://localhost:3000/health

echo "====== DEPURACIÓN COMPLETA ======"