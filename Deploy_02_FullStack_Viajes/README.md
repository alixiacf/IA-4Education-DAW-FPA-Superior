Aplicación de Mapa de Viajes

Una aplicación web full-stack para rastrear lugares visitados y crear listas de lugares deseados para viajar. Los usuarios pueden marcar en un mapa interactivo los lugares que han visitado o desean visitar, compartir sus experiencias y ver las aventuras de otros viajeros.

🌟 Características
📍 Marcar lugares visitados y deseados en un mapa interactivo.
👥 Soporte multiusuario con perfiles individuales.
🌎 Ver todos los marcadores de viaje de los usuarios en una vista consolidada.
⭐ Calificar y reseñar lugares visitados.
🗺️ Interfaz de mapa interactivo utilizando Leaflet.
💫 UI hermosa y responsiva con Tailwind CSS.

🛠️ Tecnología Utilizada

Frontend
React con TypeScript para una experiencia de usuario rica y tipada.
Leaflet para el mapa interactivo.
Tailwind CSS para la estilización rápida y responsiva.
Lucide React para los iconos.
Vite como herramienta de construcción.

Backend
Node.js con Express para construir una API RESTful.
MongoDB para almacenamiento de datos de usuarios y lugares.
Arquitectura API RESTful.

🚀 Primeros Pasos
Requisitos Previos
Asegúrate de tener instalados los siguientes programas:

Docker y Docker Compose para la orquestación de contenedores.
Git para clonar el repositorio.
Instalación
Clona el repositorio:
git clone https://github.com/tuusuario/travel-map.git
cd travel-map

Crea los archivos de configuración:
Crea un archivo .env en el directorio backend con el siguiente contenido:
PORT=5000
MONGO_URI=mongodb://mongo:27017/travelmap

Inicia la aplicación utilizando Docker Compose:
docker-compose up --build

La aplicación estará disponible en:
Frontend: http://localhost
Backend API: http://localhost:5000
MongoDB: localhost:27017

📁 Estructura del Proyecto
/
├── frontend/               # Aplicación frontend en React
│   ├── src/               # Archivos fuente
│   ├── Dockerfile         # Configuración de Docker para el frontend
│   └── nginx.conf         # Configuración de Nginx para el frontend
├── backend/               # Aplicación backend en Node.js
│   ├── src/              # Archivos fuente
│   └── Dockerfile        # Configuración de Docker para el backend
└── docker-compose.yml    # Configuración de Docker Compose

🔄 Endpoints de la API

Usuarios
GET /api/users - Obtener todos los usuarios.
POST /api/users - Crear un nuevo usuario.

Lugares
GET /api/places - Obtener todos los lugares.
GET /api/places/:userId - Obtener lugares para un usuario específico.
POST /api/places - Crear un nuevo lugar.
PUT /api/places/:id - Actualizar un lugar.
DELETE /api/places/:id - Eliminar un lugar.

🛡️ Desarrollo
Para ejecutar la aplicación en modo desarrollo, sigue estos pasos:

Iniciar el backend:
cd backend
npm install
npm run dev

Iniciar el frontend:
cd frontend
npm install
npm run dev

🐳 Comandos de Docker
Construir y iniciar todos los servicios:
docker-compose up --build

Detener todos los servicios:
docker-compose down

Ver los logs de los contenedores:
docker-compose logs -f

📝 Licencia
Este proyecto está bajo la Licencia MIT. Puedes ver los detalles en el archivo LICENSE.
