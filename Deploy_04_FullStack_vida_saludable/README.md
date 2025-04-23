Healthy Life Dashboard

Una aplicación full-stack para el seguimiento de actividades físicas, planes de alimentación y métricas de salud.

🌟 Características
🏋️ Registro de entrenamientos y actividades físicas
🍎 Monitoreo de calorías y nutrición
📊 Visualización de métricas de salud
🎯 Consejos personalizados basados en datos
🔐 Autenticación segura para usuarios
📱 Diseño responsivo para dispositivos móviles y escritorio

🛠️ Tecnología utilizada

📌 Frontend
React con TypeScript
Tailwind CSS para un diseño atractivo y moderno
Vite para una compilación rápida y eficiente

🔗 Backend
Node.js con Express para la API REST
Manejo de autenticación y validación de datos

🗄️ Base de Datos
MongoDB para almacenamiento de datos persistentes
Modelado de usuarios, planes de entrenamiento y registros de salud

🐳 Contenerización
Docker y Docker Compose para una fácil implementación

🚀 Instalación y ejecución

📌 Requisitos previos
Docker y Docker Compose instalados en tu sistema
Git para la gestión de versiones

📌 Instalación
Clonar el repositorio:
git clone [repository-url]
cd Deploy_04_FullStack_vida_saludable

Iniciar la aplicación con Docker Compose:
docker-compose up -d

La aplicación estará disponible en:

🌐 Frontend: http://localhost:8080
⚙️ Backend API: http://localhost:3000

📁 Estructura del proyecto

├── backend/               # Backend con Node.js y Express
│   ├── src/               # Código fuente
│   │   ├── models/        # Modelos de base de datos
│   │   ├── routes/        # Rutas de la API
│   │   ├── controllers/   # Lógica de negocio
│   │   └── middleware/    # Middleware de autenticación y validación
│   └── Dockerfile         # Configuración de Docker para el backend
├── frontend/              # Aplicación React con TypeScript
│   ├── src/               # Código fuente
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── hooks/         # Hooks personalizados
│   │   └── services/      # Servicios de API
│   └── Dockerfile         # Configuración de Docker para el frontend
└── docker-compose.yml     # Configuración de Docker Compose

🔄 Endpoints de la API

🏋️ Entrenamientos
GET /api/workouts → Obtener todos los entrenamientos
POST /api/workouts → Crear un nuevo entrenamiento
PUT /api/workouts/:id → Actualizar un entrenamiento
DELETE /api/workouts/:id → Eliminar un entrenamiento

🍎 Dieta y Nutrición
GET /api/diet → Obtener el plan de alimentación del usuario
POST /api/diet → Crear un nuevo registro de dieta
PUT /api/diet/:id → Actualizar un registro de dieta
DELETE /api/diet/:id → Eliminar un registro de dieta

👤 Usuarios
POST /api/users/register → Registro de usuario
POST /api/users/login → Inicio de sesión
GET /api/users/:id → Obtener información de un usuario

🛡️ Desarrollo
Para ejecutar la aplicación en modo desarrollo:

Iniciar el backend:
cd backend
npm install
npm run dev

Iniciar el frontend:
cd frontend
npm install
npm run dev

🐳 Comandos útiles en Docker
Construir y levantar los servicios
docker-compose up --build

Detener todos los servicios
docker-compose down

Ver registros en tiempo real
docker-compose logs -f

📝 Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

🤝 Contribuir
Haz un fork del repositorio
Crea una nueva rama con tu feature (git checkout -b feature/NuevaFuncionalidad)
Realiza tus cambios y haz commit (git commit -m 'Agregado: NuevaFuncionalidad')
Envía los cambios a tu fork (git push origin feature/NuevaFuncionalidad)
Abre un Pull Request
