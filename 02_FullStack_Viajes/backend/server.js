const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const setupSwagger = require('./swagger'); // Importamos Swagger
require('dotenv').config();

// Inicializar la aplicación Express
const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Configurar Swagger después de inicializar `app`
setupSwagger(app);

// Importar rutas
app.use('/api/places', require('./routes/places'));
app.use('/api/users', require('./routes/users'));

// Manejador de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));

