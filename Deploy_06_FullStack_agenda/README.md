# Task Management Application

Aplicación full-stack para la gestión de tareas con seguimiento de tiempos estimados y reales.

## Características

- Creación y gestión de tareas.
- Registro del tiempo estimado de finalización.
- Seguimiento del tiempo real empleado en cada tarea.
- Visualización de la diferencia entre el tiempo estimado y el real.
- Interfaz intuitiva y fácil de usar.

## Tecnologías Utilizadas

- **Frontend**: React, TypeScript, Vite, Zustand, Tailwind CSS.
- **Backend**: Node.js, Express.
- **Base de Datos**: MongoDB.
- **Contenerización**: Docker, Docker Compose.

## Estructura del Proyecto

```
├── backend/               # API backend en Node.js
│   ├── src/               # Código fuente
│   │   ├── models/        # Modelos de base de datos
│   │   ├── routes/        # Rutas de la API
│   │   └── controllers/   # Controladores de la API
│   └── Dockerfile         # Configuración de Docker para el backend
├── frontend/              # Aplicación frontend en React
│   ├── src/               # Código fuente
│   │   ├── components/    # Componentes de UI
│   │   ├── pages/         # Páginas principales
│   │   ├── store/         # Estado global con Zustand
│   │   └── services/      # Servicios para comunicación con la API
│   └── Dockerfile         # Configuración de Docker para el frontend
└── docker-compose.yml     # Configuración de Docker Compose
```

## Instalación y Uso

### Requisitos Previos

- Docker y Docker Compose instalados en tu sistema.
- Git para el control de versiones.

### Instalación

1. Clonar el repositorio:
   ```bash
   git clone <repository-url>
   cd Deploy_06_FullStack_agenda
   ```

2. Iniciar la aplicación con Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Acceder a la aplicación:
   - **Frontend**: [http://localhost:8080](http://localhost:8080)
   - **Backend API**: [http://localhost:3000](http://localhost:3000)

### Detener la Aplicación

Para detener la aplicación:
```bash
docker-compose down
```

Para detener y eliminar volúmenes (borrar todos los datos almacenados):
```bash
docker-compose down -v
```

## Variables de Entorno

- **Frontend**:
  - `VITE_API_URL`: URL de la API backend.

- **Backend**:
  - `MONGO_URI`: Cadena de conexión a MongoDB.

## Desarrollo

Para desarrollo, la configuración de `docker-compose` monta los directorios locales como volúmenes, permitiendo la recarga en vivo al realizar cambios en el código.

## Comunicación entre Servicios

- El **frontend** se comunica con el **backend** mediante llamadas a la API REST.
- El **backend** interactúa con la base de datos **MongoDB** para el almacenamiento y gestión de tareas.

