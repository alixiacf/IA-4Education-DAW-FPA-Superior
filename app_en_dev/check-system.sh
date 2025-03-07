#!/bin/bash
# Script para verificar el estado del sistema y mostrar diagnóstico

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== VERIFICACIÓN DEL SISTEMA RAG PDF =====${NC}"

# Verificar los contenedores
echo -e "${YELLOW}Verificando contenedores...${NC}"
if docker ps | grep -q ollama && docker ps | grep -q chroma && docker ps | grep -q backend && docker ps | grep -q frontend; then
    echo -e "${GREEN}✓ Todos los contenedores están en ejecución${NC}"
else
    echo -e "${RED}✗ Algunos contenedores no están en ejecución:${NC}"
    echo "Ollama: $(docker ps | grep ollama || echo 'NO RUNNING')"
    echo "ChromaDB: $(docker ps | grep chroma || echo 'NO RUNNING')"
    echo "Backend: $(docker ps | grep backend || echo 'NO RUNNING')"
    echo "Frontend: $(docker ps | grep frontend || echo 'NO RUNNING')"
    
    echo -e "\n${YELLOW}Intentando reiniciar los contenedores...${NC}"
    docker-compose up -d
    sleep 5
    
    if docker ps | grep -q ollama && docker ps | grep -q chroma && docker ps | grep -q backend && docker ps | grep -q frontend; then
        echo -e "${GREEN}✓ Todos los contenedores ahora están en ejecución${NC}"
    else
        echo -e "${RED}✗ Algunos contenedores siguen sin ejecutarse. Revisa los logs:${NC}"
        echo "docker-compose logs"
    fi
fi

# Verificar la red de Docker
echo -e "\n${YELLOW}Verificando la red de Docker...${NC}"
if docker network ls | grep -q app_network; then
    echo -e "${GREEN}✓ Red 'app_network' encontrada${NC}"
    
    # Mostrar contenedores en la red
    echo -e "\n${YELLOW}Contenedores en la red 'app_network':${NC}"
    docker network inspect app_network -f '{{range .Containers}}{{.Name}} {{.IPv4Address}}{{println}}{{end}}'
else
    echo -e "${RED}✗ Red 'app_network' no encontrada${NC}"
    echo "Ejecuta: docker-compose down && docker-compose up -d"
fi

# Verificar conectividad entre contenedores
echo -e "\n${YELLOW}Verificando conectividad entre contenedores...${NC}"

# Backend -> Ollama
echo "Backend -> Ollama:"
if docker exec -it backend ping -c 2 ollama > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend puede hacer ping a Ollama${NC}"
else
    echo -e "${RED}✗ Backend NO puede hacer ping a Ollama${NC}"
fi

# Backend -> ChromaDB
echo "Backend -> ChromaDB:"
if docker exec -it backend ping -c 2 chroma > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend puede hacer ping a ChromaDB${NC}"
else
    echo -e "${RED}✗ Backend NO puede hacer ping a ChromaDB${NC}"
fi

# Verificar API de Ollama
echo -e "\n${YELLOW}Verificando API de Ollama...${NC}"
echo "Probando conexión desde el contenedor backend a ollama:"
docker exec backend curl -v http://ollama:11434/api/version || echo "Error al conectar via nombre de servicio"

echo "Probando conexión directa a la IP de ollama:"
# Obtener la IP de ollama
OLLAMA_IP=$(docker network inspect app_network -f '{{range .Containers}}{{if eq .Name "ollama"}}{{.IPv4Address}}{{end}}{{end}}' | cut -d/ -f1)
echo "IP de Ollama: $OLLAMA_IP"
if [ -n "$OLLAMA_IP" ]; then
    docker exec backend curl -v http://$OLLAMA_IP:11434/api/version || echo "Error al conectar vía IP"
fi

echo "Probando conexión desde el host:"
curl -v http://localhost:11434/api/version || echo "Error al conectar desde el host"

# Verificar modelos disponibles
echo -e "\n${YELLOW}Verificando modelos disponibles en Ollama:${NC}"
MODEL_LIST=$(docker exec ollama ollama list 2>/dev/null)
if [ -n "$MODEL_LIST" ]; then
    echo -e "${GREEN}✓ Modelos disponibles:${NC}"
    echo "$MODEL_LIST"
else
    echo -e "${RED}✗ No hay modelos disponibles en Ollama${NC}"
    
    # Verificar estado de Ollama
    echo -e "\n${YELLOW}Verificando estado del contenedor Ollama:${NC}"
    docker logs --tail 20 ollama
fi

# Verificar API de ChromaDB
echo -e "\n${YELLOW}Verificando API de ChromaDB...${NC}"
CHROMA_HEALTH=$(docker exec -it backend curl -s -o /dev/null -w "%{http_code}" http://chroma:8000/api/v1/heartbeat)
if [ "$CHROMA_HEALTH" = "200" ]; then
    echo -e "${GREEN}✓ API de ChromaDB responde correctamente (HTTP 200)${NC}"
else
    echo -e "${RED}✗ API de ChromaDB no responde correctamente (HTTP $CHROMA_HEALTH)${NC}"
fi

# Verificar API del Backend
echo -e "\n${YELLOW}Verificando API del Backend...${NC}"
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$BACKEND_HEALTH" = "200" ]; then
    echo -e "${GREEN}✓ API del Backend responde correctamente (HTTP 200)${NC}"
    
    # Mostrar información detallada de salud
    echo -e "\n${YELLOW}Información detallada de salud del Backend:${NC}"
    curl -s http://localhost:3000/health
    echo ""
else
    echo -e "${RED}✗ API del Backend no responde correctamente (HTTP $BACKEND_HEALTH)${NC}"
fi

# Verificar Frontend
echo -e "\n${YELLOW}Verificando Frontend...${NC}"
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080)
if [ "$FRONTEND_HEALTH" = "200" ]; then
    echo -e "${GREEN}✓ Frontend responde correctamente (HTTP 200)${NC}"
else
    echo -e "${RED}✗ Frontend no responde correctamente (HTTP $FRONTEND_HEALTH)${NC}"
fi

echo -e "\n${GREEN}===== VERIFICACIÓN COMPLETADA =====${NC}"
echo -e "Puedes acceder a la aplicación en: ${GREEN}http://localhost:8080${NC}"
echo ""