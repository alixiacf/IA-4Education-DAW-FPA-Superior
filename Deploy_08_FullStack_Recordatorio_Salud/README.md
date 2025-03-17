# Aplicación de Recordatorio de Salud

Esta aplicación permite a los usuarios gestionar sus citas médicas y recibir recordatorios.

## Instrucciones para ejecutar

### 1. Prerequisitos

- Docker y Docker Compose instalados
- Node.js 20.x o superior (para desarrollo local)

### 2. Inicio rápido

Para ejecutar la aplicación:

```bash
# Detener cualquier contenedor previo y eliminar volúmenes
docker-compose down -v

# Iniciar los contenedores (instalará dependencias automáticamente)
docker-compose up
```

### 3. Verificación

Una vez que todos los contenedores estén en funcionamiento:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MongoDB: mongodb://localhost:27017/healthreminder

### 4. Desarrollo local (alternativa sin Docker)

Si prefieres ejecutar la aplicación localmente:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## Credenciales de prueba

- Email: test@example.com
- Contraseña: password123

## Arquitectura

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express
- **Base de datos**: MongoDB

## Endpoints principales

- `/api/auth/login` - Iniciar sesión
- `/api/auth/register` - Registrar nuevo usuario
- `/api/appointments` - Gestión de citas
- `/api/notifications` - Gestión de notificaciones