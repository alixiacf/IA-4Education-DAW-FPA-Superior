# GameRecommender - Sistema de Biblioteca y Recomendación de Videojuegos

Una aplicación full-stack para que los usuarios registren los videojuegos que han jugado y reciban recomendaciones personalizadas según sus preferencias.

## Características

- Registro y gestión de usuarios
- Creación y administración de biblioteca de videojuegos
- Catálogo de juegos con filtros por géneros
- Sistema de recomendación basado en etiquetas y preferencias del usuario
- Interfaz responsiva y fácil de usar

## Tecnologías Utilizadas

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Mongoose
- **Base de Datos**: MongoDB
- **Containerización**: Docker, Docker Compose

## Estructura del Proyecto

```
├── backend/               # API backend en Node.js
│   ├── src/               # Código fuente
│   │   ├── models/        # Modelos de base de datos
│   │   ├── routes/        # Rutas de la API REST
│   │   ├── controllers/   # Controladores de la lógica de negocio
│   └── Dockerfile         # Configuración de Docker para el backend
├── frontend/              # Aplicación frontend en React
│   ├── src/               # Código fuente
│   │   ├── components/    # Componentes de UI
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── services/      # Servicios para llamadas a la API
│   │   └── types/         # Definiciones de tipos en TypeScript
│   └── Dockerfile         # Configuración de Docker para el frontend
└── docker-compose.yml     # Configuración de Docker Compose
```

## Instalación y Ejecución

### Prerrequisitos

- Tener instalados Docker y Docker Compose
- Git para la gestión de versiones

### Pasos de Instalación

1. Clonar el repositorio:
   ```bash
   git clone <repository-url>
   cd Deploy_05_Fullstack_Videojuegos
   ```

2. Iniciar la aplicación con Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Acceder a la aplicación:
   - **Frontend**: http://localhost:8080
   - **Backend API**: http://localhost:3000

## Desarrollo

Para desarrollar la aplicación localmente:

1. Iniciar los contenedores en modo desarrollo:
   ```bash
   docker-compose up
   ```

2. Realizar cambios en el código y ver los resultados en tiempo real gracias a los volúmenes configurados en `docker-compose.yml`.

## Despliegue

La aplicación puede desplegarse en cualquier entorno compatible con Docker:

1. Construir las imágenes listas para producción:
   ```bash
   docker-compose build
   ```

2. Subir y desplegar el stack en el proveedor de hosting correspondiente.

## Licencia

[Licencia MIT](LICENSE)
