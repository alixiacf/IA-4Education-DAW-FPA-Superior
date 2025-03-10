# Gemma2 Chat Application with CPU Support

This project implements a web-based chat interface for interacting with Google's Gemma2 language model running locally through Ollama without GPU acceleration.

## Overview

The application consists of three main components:
- **Ollama service**: Runs the Gemma2 AI model without GPU acceleration
- **Python backend**: Provides a web interface using Gradio and communicates with Ollama
- **Docker infrastructure**: Orchestrates the components with proper networking
## Features

- Local deployment of Gemma2 language model
- GPU acceleration for faster inference
- Simple web chat interface
- Containerized setup for easy deployment

## Requirements

- Docker and Docker Compose


## Architecture

### Docker Compose Configuration

The application is orchestrated using Docker Compose with the following services:

1. **Ollama Service**:
   - Based on the `ollama/ollama` image
   - Custom build process that adds the `run.sh` script
   - Automatically downloads the Gemma2 model on startup
   - Exposes port 11434 for API access

2. **Web Application**:
   - Python-based backend using Gradio
   - Provides a user-friendly chat interface
   - Communicates with Ollama via its API
   - Exposes port 7860 for web access

### Network Configuration

Both services communicate over a bridged network called `mynetwork`, with the web application configured to depend on the Ollama service to ensure proper startup order.

## How It Works

1. The Ollama container starts and runs the `run.sh` script which:
   - Starts the Ollama service
   - Downloads the Gemma2 model automatically
   - Keeps the container running

2. The Python backend container:
   - Provides a web UI through Gradio
   - Takes user input and sends it to the Ollama API
   - Streams responses back to the user interface



## How to Run

1. Clone this repository
3. Run `docker-compose up -d`
4. Access the chat interface at `http://localhost:7860`

## Troubleshooting

- For model download issues, check your internet connection and available disk space
- If the web interface cannot connect to Ollama, ensure both containers are running properly

## License

This project is open source and available for educational and personal use.