import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import appointmentsRouter from './routes/appointments.js';
import notificationsRouter from './routes/notifications.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import connectDB from './config/database.js';
import mongoose from 'mongoose';

dotenv.config();

// Verificar dependencias
console.log('Mongoose instalado:', !!mongoose);

// Conectar a MongoDB
connectDB();

// Monitorear la conexión
mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado correctamente');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado');
});

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS para permitir peticiones desde el frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://frontend:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/notifications', notificationsRouter);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});