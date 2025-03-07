# PDF RAG Chatbot

A web application for interacting with PDF documents using Retrieval Augmented Generation (RAG). This application allows users to upload PDF documents, process them, and ask questions about their content, getting answers that are grounded in the document content.

## Features

- Upload and process PDF documents
- Generate embeddings and create a vector store for semantic search
- Ask questions about the content of the uploaded PDFs
- View source citations for the answers
- Support for code highlighting and markdown rendering

## Architecture

The application consists of four main components:

1. **Ollama Service**: LLM service for text generation and embeddings
2. **ChromaDB**: Vector database for storing document embeddings
3. **Backend**: Node.js Express server handling PDF processing and RAG implementation
4. **Frontend**: Simple HTML/CSS/JS application for user interaction

## Getting Started

### Prerequisites

- Docker y Docker Compose
- Conexión a Internet (para descargar modelos de Ollama)
- 8GB+ RAM recomendado para ejecutar los LLMs

### Instalación en 2 pasos (método recomendado)

1. **Iniciar los servicios**:
   ```bash
   chmod +x run.sh download-model.sh check-system.sh
   ./run.sh
   ```

2. **Descargar un modelo**:
   ```bash
   ./download-model.sh
   ```

3. Acceder a la aplicación en `http://localhost:8080`

### Descripción del proceso

El proceso de instalación se ha separado en dos pasos principales:

1. **Ejecución de servicios**: El script `run.sh` se encarga de:
   - Construir e iniciar todos los contenedores con Docker Compose
   - Configurar la red para comunicación entre servicios
   - Verificar que todos los servicios estén funcionando

2. **Descarga de modelos**: El script `download-model.sh` se encarga de:
   - Mostrar los modelos disponibles para descargar
   - Permitir seleccionar qué modelo quieres utilizar
   - Descargar el modelo seleccionado en el contenedor de Ollama

### Verificación del sistema

Si encuentras problemas, puedes ejecutar el script de diagnóstico:

```bash
./check-system.sh
```

Este script:
- Verifica que todos los contenedores estén en ejecución
- Comprueba la conectividad entre servicios
- Verifica que las APIs de Ollama y ChromaDB respondan correctamente
- Muestra los modelos disponibles en Ollama

### Comandos útiles

- Ver logs de Ollama: `docker logs ollama`
- Ver logs del backend: `docker logs backend`
- Ver logs de todos los servicios: `docker-compose logs`
- Reiniciar todos los servicios: `docker-compose down && docker-compose up -d`
- Detener todos los servicios: `docker-compose down`

### Solución de problemas comunes

1. **No se pueden descargar modelos**:
   - Asegúrate de tener conexión a Internet
   - Verifica que el contenedor de Ollama esté funcionando: `docker ps | grep ollama`
   - Intenta descargar manualmente: `docker exec -it ollama ollama pull llama2`

2. **Error de conexión entre servicios**:
   - Verifica que todos los contenedores estén en la misma red: `docker network inspect app_network`
   - Reinicia todos los servicios: `docker-compose down && docker-compose up -d`

3. **La aplicación web no muestra modelos**:
   - Verifica que hayas descargado al menos un modelo con `./download-model.sh`
   - Verifica los modelos disponibles: `docker exec ollama ollama list`
   - Revisa los logs del backend: `docker logs backend`

## Usage

1. Wait for all services to start (Ollama may take a while to download the model on first run)
2. Select the model you want to use from the dropdown (depends on models available in Ollama)
3. Upload a PDF document using the "Upload PDF" button
4. Wait for the document to be processed
5. Ask questions about the document content in the chat interface

## Project Structure

```
/
├── docker-compose.yml       # Docker Compose configuration
├── backend/                 # Backend service
│   ├── Dockerfile          # Backend Docker configuration
│   ├── package.json        # Node.js dependencies
│   ├── server.js           # Main server file with RAG implementation
│   └── pdfs/               # Directory for uploaded PDFs
├── frontend/               # Frontend service
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styles
│   └── script.js           # Frontend JavaScript
```

## API Endpoints

The backend exposes the following API endpoints:

- `GET /models`: Get list of available models
- `POST /upload-pdf`: Upload and process a PDF document
- `GET /documents`: Get list of uploaded documents
- `POST /rag-chat`: Send a query to the RAG system
- `POST /chat`: Standard chat endpoint without RAG
- `GET /health`: Health check endpoint

## License

MIT

## Acknowledgments

- [Ollama](https://ollama.com/) for local LLM inference
- [ChromaDB](https://www.trychroma.com/) for vector database
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) for PDF parsing