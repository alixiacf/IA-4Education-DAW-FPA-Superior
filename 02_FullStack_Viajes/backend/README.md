# Backend de Travel Map 🌍
# 🚀 Descripción del Proyecto
Este es el backend de Travel Map, una aplicación que permite a los usuarios registrar los lugares que han visitado o desean visitar en un mapa interactivo. Se utiliza Node.js + Express + MongoDB para gestionar los datos y Docker para el despliegue.
#📌 Tecnologías Utilizadas
✅ Node.js - Servidor backend
✅ Express.js - Framework web para Node.js
✅ MongoDB + Mongoose - Base de datos NoSQL
✅ Docker + Docker Compose - Despliegue en contenedores
✅ Swagger - Documentación de la API
✅ CORS - Permitir peticiones desde frontend
✅ dotenv - Manejo de variables de entorno
# 📌 Estructura del Proyecto
 
```
/backend
│── server.js            # Servidor Express
│── db.js                # Configuración de Mongoose
│── swagger.js           # Configuración de Swagger
│── models
│   ├── Place.js         # Esquema de lugares
│   ├── User.js          # Esquema de usuario
│── routes
│   ├── places.js        # Endpoints de lugares
│   ├── users.js         # Endpoints de usuarios
│── controllers
│   ├── placesController.js # Controladores de lugares
│   ├── usersController.js  # Controladores de usuarios
│── package.json         # Dependencias
│── docker-compose.yml   # Configuración Docker
│── Dockerfile           # Configuración de imagen Docker
│── .dockerignore        # Archivos ignorados en Docker
│── .env.example         # Variables de entorno de ejemplo

```
# 📌 Instalación y Configuración Local
1️⃣ Clonar el Repositorio
```
git clone https://github.com/usuario/travel-map-backend.git
cd travel-map-backend

```
2️⃣ Instalar Dependencias
 ```
 npm install
 ```
 3️⃣ Configurar Variables de Entorno
 Crear un archivo .env en la raíz con el siguiente contenido:
  ```
  PORT=5000
MONGO_URI=mongodb://localhost:27017/travelmap
  ```
4️⃣ Ejecutar el Servidor en Desarrollo
```
npm run dev
```
El servidor estará disponible en http://localhost:5000
-------------------------------------
## 📌 Despliegue con Docker
#1️⃣ Construir y Levantar Contenedores
```
docker-compose up --build
```
Backend en http://localhost:5000
MongoDB en mongodb://mongo:27017

2️⃣ Apagar Contenedores
```
docker-compose down
```
--------------------------------------
📌 Documentación de la API
📄 Swagger UI disponible en:
🔗 http://localhost:5000/api-docs
Ejemplo de JSON de Petición
```
{
    "userId": "65a1b2c3d4e5f67890123456",
    "location": { "lat": 40.7128, "lng": -74.0060 },
    "type": "visited",
    "review": "Increíble experiencia en Nueva York.",
    "experienceTemp": 8
}

```
📌 Endpoints de la API
* POST	/api/users	Crear un usuario
* GET	/api/users	Obtener todos los usuarios
* POST	/api/places	Guardar un lugar (visitado/deseado)
* GET	/api/places/user/:id	Obtener los lugares de un usuario específico 
* GET	/api-docs	Documentación interactiva con Swagger

📌 Contribuciones
🚀 ¿Tienes ideas o mejoras? ¡Forkea el repo y haz un PR! 🎯
📧 Contacto:  

📌 Licencia
MIT © 2025 Travel Map Project.
