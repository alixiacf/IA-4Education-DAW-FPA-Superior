# 🐾 Pet Vaccination Tracker

Un sistema completo para el seguimiento de vacunas de mascotas y conexión con clínicas veterinarias. Permite a los dueños registrar a sus mascotas, llevar un control de vacunación y encontrar clínicas cercanas a través de un mapa interactivo.

---

## ✨ Características

- 📋 Registro y gestión de usuarios
- 🐶 Creación y administración de perfiles de mascotas
- 💉 Seguimiento del historial de vacunación
- 📍 Mapa interactivo con clínicas veterinarias cercanas
- 📅 Notificaciones y recordatorios de vacunación
- 🔐 Seguridad con autenticación JWT
- 📱 Diseño responsivo adaptable a cualquier dispositivo

---

## 🛠️ Tecnologías

### **Frontend**
- React con TypeScript
- Vite para desarrollo rápido
- Tailwind CSS para diseño moderno y responsivo
- Leaflet para mapas interactivos

### **Backend**
- Node.js con Express.js
- MongoDB para almacenamiento de datos
- Autenticación con JWT
- RESTful API

### **Infraestructura**
- Docker y Docker Compose para despliegue
- Nginx como proxy inverso

---

## 📁 Estructura del Proyecto

```
/
├── backend/               # API en Node.js
│   ├── src/               # Código fuente
│   │   ├── models/        # Modelos de la base de datos
│   │   ├── routes/        # Rutas del API
│   │   ├── controllers/   # Controladores de lógica de negocio
│   │   ├── middleware/    # Middleware de autenticación y validación
│   └── Dockerfile         # Configuración de Docker para backend
├── frontend/              # Aplicación en React
│   ├── src/               # Código fuente
│   │   ├── components/    # Componentes de la UI
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # Conexión con la API
│   │   ├── hooks/         # Hooks personalizados
│   ├── Dockerfile         # Configuración de Docker para frontend
└── docker-compose.yml     # Orquestación de contenedores
```

---

## 🚀 Instalación y Ejecución

### **Requisitos previos**
- Docker y Docker Compose
- Git instalado

### **Pasos de instalación**

1. Clonar el repositorio:
   ```bash
   git clone <repository-url>
   cd pet-vaccination-tracker
   ```

2. Crear archivos de entorno:
   ```bash
   cd backend
   touch .env
   ```
   **Ejemplo de `.env` en backend:**
   ```env
   PORT=5000
   MONGO_URI=mongodb://mongo:27017/petvaccination
   JWT_SECRET=supersecreto
   ```

3. Iniciar la aplicación con Docker:
   ```bash
   docker-compose up --build
   ```

4. Acceder a la aplicación:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔄 Endpoints de la API

### **Usuarios**
- `POST /api/users/register` - Registrar un usuario
- `POST /api/users/login` - Iniciar sesión
- `GET /api/users/profile` - Obtener perfil de usuario

### **Mascotas**
- `POST /api/pets` - Crear perfil de mascota
- `GET /api/pets/:id` - Obtener detalles de una mascota
- `PUT /api/pets/:id` - Actualizar información de una mascota
- `DELETE /api/pets/:id` - Eliminar una mascota

### **Vacunas**
- `POST /api/vaccinations` - Registrar vacuna para una mascota
- `GET /api/vaccinations/:petId` - Obtener historial de vacunación

### **Clínicas**
- `GET /api/clinics` - Listar clínicas veterinarias cercanas

---

## 🛡️ Desarrollo

Para ejecutar la aplicación sin Docker:

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🐳 Comandos útiles de Docker

- Iniciar la aplicación en segundo plano:
  ```bash
  docker-compose up -d
  ```
- Detener la aplicación:
  ```bash
  docker-compose down
  ```
- Ver logs de los contenedores:
  ```bash
  docker-compose logs -f
  ```

---

## 🌍 Despliegue

La aplicación puede desplegarse en cualquier entorno que soporte Docker:

1. Construir imágenes:
   ```bash
   docker-compose build
   ```
2. Subirlas a un servidor o servicio de hosting compatible.

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🤝 Contribuciones

¡Toda contribución es bienvenida! Para colaborar:

1. Haz un fork del repositorio
2. Crea una rama con tu nueva funcionalidad (`git checkout -b feature/NuevaFuncionalidad`)
3. Realiza un commit (`git commit -m 'Agregada NuevaFuncionalidad'`)
4. Sube tu código (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

---

## ✨ Agradecimientos

- **Leaflet** por el soporte de mapas interactivos
- **Tailwind CSS** por el diseño estilizado
- **MongoDB** por la base de datos flexible para manejo de datos de mascotas

---

📌 **Desarrollado con ❤️ para facilitar el seguimiento de la salud de las mascotas**

