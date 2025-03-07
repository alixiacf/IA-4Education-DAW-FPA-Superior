#!/bin/bash
# Script para iniciar la aplicación completa

# Colores para los mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Iniciando la aplicación de RAG PDF =====${NC}"

# Detener contenedores anteriores si existen
echo -e "${YELLOW}Deteniendo contenedores anteriores si existen...${NC}"
docker compose down -v

# Paso 1: Construir e iniciar Docker Compose con nueva red
echo -e "${YELLOW}Paso 1/2: Construyendo e iniciando contenedores...${NC}"
docker compose build --no-cache
docker compose up -d

# Esperar a que los contenedores estén listos
echo "Esperando a que los contenedores estén en funcionamiento..."
sleep 30

# Comprobar si todos los contenedores están funcionando
if ! docker ps | grep -q ollama || ! docker ps | grep -q chroma || ! docker ps | grep -q backend || ! docker ps | grep -q frontend; then
  echo -e "${RED}Error: No todos los contenedores están en ejecución.${NC}"
  echo "Comprueba los logs con 'docker-compose logs'"
  docker ps
  exit 1
fi

echo -e "${GREEN}✓ Todos los contenedores están en ejecución${NC}"

# Paso 2: Se elimina la verificacion de ollama y chroma.
echo -e "${YELLOW}Paso 2/2: Verificacion de las apis eliminado.${NC}"
echo -e "${YELLOW}Paso 2/2: La verificacion del funcionamiento de ollama y chroma ahora debe de realizarse mediante el backend o frontend.${NC}"

echo -e "${GREEN}===== Configuración completada =====${NC}"
echo -e "Puedes acceder a la aplicación en: ${GREEN}http://localhost:8080${NC}"
echo -e "\n${YELLOW}Importante:${NC} Ahora necesitas descargar un modelo para Ollama:"
echo -e "Ejecuta: ${GREEN}./download-model.sh${NC}"
echo -e "\nOtros comandos útiles:"
echo -e "- Verificar estado del sistema: ${YELLOW}./check-system.sh${NC}"
echo -e "- Ver logs completos: ${YELLOW}docker-compose logs${NC}"
echo -e "- Ver logs de Ollama: ${YELLOW}docker logs ollama${NC}"
echo -e "- Ver logs del backend: ${YELLOW}docker logs backend${NC}"
echo -e "- Detener la aplicación: ${YELLOW}docker-compose down${NC}\n"
