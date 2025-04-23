Aplicación de Chat Gemma2 con Soporte para GPU 💬⚡

Este proyecto implementa una interfaz de chat basada en la web para interactuar con el modelo de lenguaje Gemma2 de Google, ejecutado localmente a través de Ollama con aceleración GPU.

Descripción General
La aplicación consta de tres componentes principales:

Servicio Ollama: Ejecuta el modelo de IA Gemma2 con aceleración GPU.
Backend en Python: Proporciona una interfaz web usando Gradio y se comunica con Ollama.
Infraestructura Docker: Orquesta los componentes con la red adecuada y el paso de GPU.

Características ✨
Despliegue local del modelo de lenguaje Gemma2.
Aceleración GPU para una inferencia más rápida ⚡.
Interfaz de chat web simple y fácil de usar 💻.
Configuración en contenedor para un despliegue sencillo 🚀.

Requisitos 🔧
Docker y Docker Compose.
GPU NVIDIA con soporte CUDA 🖥️.
NVIDIA Container Toolkit instalado.
Se recomienda tener al menos 8 GB de VRAM en la GPU para un rendimiento óptimo.

Arquitectura 🏗️
Configuración de Docker Compose
La aplicación se orquesta utilizando Docker Compose con los siguientes servicios:

Servicio Ollama:

Basado en la imagen ollama/ollama.
Proceso de construcción personalizado que incluye el script run.sh.
Configuración de paso de GPU para la aceleración 🚀.
Descarga automática del modelo Gemma2 al iniciar.
Expone el puerto 11434 para acceso a la API.
Aplicación Web:

Backend en Python utilizando Gradio 🐍.
Proporciona una interfaz de chat amigable para el usuario.
Se comunica con Ollama a través de su API 🔗.
Expone el puerto 7860 para acceso web.

Configuración de Red 🌐
Ambos servicios se comunican a través de una red puente llamada mynetwork, con la aplicación web configurada para depender del servicio Ollama, asegurando que se inicien en el orden correcto.

Funcionamiento ⚙️
El contenedor de Ollama se inicia y ejecuta el script run.sh, que:

Inicia el servicio Ollama.
Descarga automáticamente el modelo Gemma2 📥.
Mantiene el contenedor en ejecución.
El contenedor del backend en Python:

Proporciona una interfaz web a través de Gradio.
Recibe la entrada del usuario y la envía a la API de Ollama.
Muestra las respuestas de la API de vuelta en la interfaz de usuario.
La aceleración GPU:

Los controladores NVIDIA se pasan al contenedor Ollama 🎮.
Habilita la aceleración por hardware para la inferencia.
Mejora significativamente los tiempos de respuesta ⏱️.

Cómo Ejecutarlo 🚀
Clona este repositorio.
Asegúrate de que el NVIDIA Container Toolkit esté instalado correctamente.
Ejecuta docker-compose up -d.
Accede a la interfaz de chat en http://localhost:7860.

Solución de Problemas 🛠️
Si encuentras errores relacionados con la GPU, verifica que el NVIDIA Container Toolkit esté instalado correctamente.
Si hay problemas al descargar el modelo, revisa tu conexión a Internet 🌐 y el espacio disponible en disco.
Si la interfaz web no puede conectarse a Ollama, asegúrate de que ambos contenedores estén en ejecución correctamente.

Licencia 📄
Este proyecto es de código abierto y está disponible para uso educativo y personal.
