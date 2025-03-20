Aplicación de Chat Gemma2 con Soporte para CPU

Este proyecto implementa una aplicación web de chat que permite interactuar con el modelo de lenguaje Gemma2 de Google, ejecutado localmente a través de Ollama sin necesidad de una GPU. Está diseñado para proporcionar una experiencia de uso fluida y accesible en cualquier sistema que cumpla con los requisitos mínimos.

📌 Características Principales
✅ Implementación local del modelo Gemma2, sin depender de servidores en la nube.
✅ Ejecución basada en CPU, ideal para sistemas sin aceleración por GPU.
✅ Interfaz web intuitiva basada en Gradio, accesible desde el navegador.
✅ Configuración con Docker, lo que simplifica la instalación y ejecución.
✅ Arquitectura modular, con separación clara entre backend y el servicio de IA.
✅ Automatización de despliegue, asegurando una instalación sencilla con un solo comando.

🛠️ Requisitos Previos
Para ejecutar correctamente la aplicación, asegúrate de contar con lo siguiente en tu sistema:
Docker (última versión recomendada).
Docker Compose (para la gestión de los contenedores).
Conexión a internet para la descarga inicial del modelo.
Al menos 4 GB de RAM disponibles para una ejecución óptima en CPU.

📂 Estructura del Proyecto
El proyecto está organizado en los siguientes componentes:

📁 backend/ → Contiene el código fuente de la API y la interfaz web.
📁 config/ → Archivos de configuración y scripts necesarios para la ejecución.
📁 docker/ → Configuración y archivos para la gestión de contenedores.
📁 models/ → Modelos de lenguaje descargados y almacenados localmente.
📜 docker-compose.yml → Archivo de configuración para ejecutar los contenedores.
📜 README.md → Documentación del proyecto.

⚙️ Arquitectura del Sistema
La aplicación utiliza Docker Compose para orquestar los diferentes servicios:

1️⃣ Servicio de Ollama (Inteligencia Artificial)
Basado en la imagen oficial ollama/ollama.
Descarga y ejecuta automáticamente el modelo Gemma2 al iniciarse.
Expone la API en el puerto 11434.
Contiene un script run.sh que gestiona la inicialización.

2️⃣ Backend y WebApp
Implementado en Python utilizando Gradio para la interfaz de usuario.
Actúa como puente entre el usuario y el servicio Ollama.
Expone la aplicación web en el puerto 7860.

3️⃣ Red y Comunicación
Ambos servicios están conectados a través de una red Docker llamada mynetwork.
El backend depende del servicio Ollama, asegurando el orden de inicio adecuado.

🚀 Instalación y Ejecución
Sigue estos pasos para poner en marcha la aplicación en tu sistema:

1️⃣ Clonar el Repositorio
git clone https://github.com/tuusuario/IA-Chat-Gemma2.git
cd IA-Chat-Gemma2

2️⃣ Ejecutar los Contenedores con Docker Compose
docker-compose up -d

3️⃣ Acceder a la Aplicación
Abre tu navegador y dirígete a:
🔗 http://localhost:7860

💡 Cómo Funciona
1️⃣ El servicio Ollama se inicia y descarga el modelo Gemma2 automáticamente.
2️⃣ La API backend toma las consultas del usuario y las envía a Ollama.
3️⃣ Ollama procesa la consulta y devuelve una respuesta generada por IA.
4️⃣ La respuesta se muestra en la interfaz web de Gradio en tiempo real.

🛠️ Resolución de Problemas
🔴 Problema: "No se puede descargar el modelo"
✔️ Verifica tu conexión a internet y el espacio disponible en el disco.

🔴 Problema: "La interfaz web no carga"
✔️ Asegúrate de que ambos contenedores están en ejecución con docker ps.

🔴 Problema: "No se puede conectar a Ollama"
✔️ Reinicia el servicio con:
      docker-compose restart

📜 Licencia
Este proyecto es de código abierto y puede utilizarse con fines educativos y personales.
