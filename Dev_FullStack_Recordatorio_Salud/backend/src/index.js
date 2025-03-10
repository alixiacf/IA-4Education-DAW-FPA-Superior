import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import appointmentsRouter from './routes/appointments.js';
import notificationsRouter from './routes/notifications.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

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

// Configurar proxy para Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'http://kong:8000';

// Opciones de proxy comunes
const proxyOptions = {
  target: supabaseUrl,
  changeOrigin: true,
  secure: false,
  logLevel: 'debug',
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('apikey', process.env.SUPABASE_SERVICE_ROLE_KEY);
    proxyReq.setHeader('Authorization', `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end('Proxy error: ' + err);
  }
};

// Proxy para las diferentes rutas de Supabase
app.use('/api/rest', createProxyMiddleware({
  ...proxyOptions,
  pathRewrite: {
    '^/api/rest': '/rest'
  }
}));

app.use('/api/auth/v1', createProxyMiddleware({
  ...proxyOptions,
  pathRewrite: {
    '^/api/auth/v1': '/auth/v1'
  }
}));

// Ruta general para cualquier petición a supabase
app.use('/api/v1', createProxyMiddleware({
  ...proxyOptions,
  pathRewrite: {
    '^/api/v1': '/rest/v1'
  }
}));

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/notifications', notificationsRouter);

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});