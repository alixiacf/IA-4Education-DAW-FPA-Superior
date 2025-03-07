import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Esquema para Usuario
const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  progreso: {
    peso: Number,
    medidas: String,
    entrenamientos: [{ 
      fecha: { type: Date, default: Date.now },
      detalle: String,
      duracion: Number,
      calorias: Number
    }],
    dietas: [{ 
      fecha: { type: Date, default: Date.now },
      descripcion: String,
      calorias: Number,
      proteinas: Number,
      carbohidratos: Number,
      grasas: Number
    }]
  }
});

const corsOptions = {
    origin: [
    'http://localhost:5173',  // si quieres permitir también vite corriendo local
    'http://localhost:8080'   // el contenedor que acabas de mapear
  ],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);

const app = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Conexión a MongoDB
mongoose.connect('mongodb://root:password@base_datos:27017/test?authSource=admin');

// GET - Listar todos los usuarios
app.get('/usuarios', async (_req, res) => {
  try {
    console.log('Listando usuarios...');
    const usuarios = await UsuarioModel.find();
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar usuarios' });
  }
});

// POST - Crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, email, progreso } = req.body;
    console.log('Creando nuevo usuario...');
    const nuevoUsuario = await UsuarioModel.create({ 
      nombre, 
      email, 
      progreso
    });
    return res.status(201).json(nuevoUsuario);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// DELETE - Eliminar un usuario
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Eliminando usuario...');
    await UsuarioModel.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// GET - Obtener un usuario por ID
app.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Buscando usuario con ID: ${id}`);
    const usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ error: 'Error al buscar usuario' });
  }
});

// PUT - Actualizar un usuario
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, progreso } = req.body;
    console.log(`Actualizando usuario con ID: ${id}`);
    
    const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(
      id,
      { nombre, email, progreso },
      { new: true }
    );
    
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    return res.json(usuarioActualizado);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// POST - Añadir entrenamiento a un usuario
app.post('/usuarios/:id/entrenamientos', async (req, res) => {
  try {
    const { id } = req.params;
    const { detalle, duracion, calorias } = req.body;
    
    const usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    usuario.progreso.entrenamientos.push({
      fecha: new Date(),
      detalle,
      duracion,
      calorias
    });
    
    await usuario.save();
    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ error: 'Error al añadir entrenamiento' });
  }
});

// POST - Añadir dieta a un usuario
app.post('/usuarios/:id/dietas', async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, calorias, proteinas, carbohidratos, grasas } = req.body;
    
    const usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    usuario.progreso.dietas.push({
      fecha: new Date(),
      descripcion,
      calorias,
      proteinas,
      carbohidratos,
      grasas
    });
    
    await usuario.save();
    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ error: 'Error al añadir dieta' });
  }
});

// GET - Obtener consejos de vida saludable (chatbot simple)
app.get('/consejos', (_req, res) => {
  const consejos = [
    "Bebe al menos 2 litros de agua al día para mantener una hidratación adecuada.",
    "Incluye 5 porciones de frutas y verduras en tu alimentación diaria.",
    "Realiza al menos 30 minutos de actividad física moderada 5 días a la semana.",
    "Duerme entre 7-8 horas diarias para favorecer la recuperación muscular.",
    "Reduce el consumo de alimentos ultraprocesados y azúcares añadidos.",
    "Incorpora proteínas magras en cada comida para favorecer la recuperación muscular.",
    "Practica técnicas de respiración o meditación para reducir el estrés.",
    "Establece objetivos SMART: específicos, medibles, alcanzables, relevantes y temporales.",
    "Planifica tus comidas semanalmente para mantener una alimentación equilibrada.",
    "Alterna entrenamientos de fuerza y cardiovasculares para un fitness completo."
  ];
  
  // Devolver un consejo aleatorio
  const consejoAleatorio = consejos[Math.floor(Math.random() * consejos.length)];
  return res.json({ consejo: consejoAleatorio });
});

app.listen(3000, () => console.log('Servidor ejecutándose en http://localhost:3000'));