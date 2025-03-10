import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Esquemas para la agenda electrónica
const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String
});

const RecadoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  titulo: String,
  descripcion: String,
  fecha: Date,
  hora: String,
  completado: {
    type: Boolean,
    default: false
  }
});

const CitaSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  servicio: String,
  fecha: Date,
  hora: String,
  descripcion: String,
  alarma: {
    type: Boolean,
    default: true
  },
  minutos_antes: {
    type: Number,
    default: 30
  }
});

const corsOptions = {
    origin: [
    'http://localhost:5173',  // si quieres permitir también vite corriendo local
    'http://localhost:8080'   // el contenedor que acabas de mapear
  ],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Modelos
const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);
const RecadoModel = mongoose.model('Recado', RecadoSchema);
const CitaModel = mongoose.model('Cita', CitaSchema);

const app = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Conexión a MongoDB
mongoose.connect('mongodb://root:password@base_datos:27017/test?authSource=admin');

// ===== USUARIOS =====

// GET - Listar todos los usuarios
app.get('/usuarios', async (_req, res) => {
  try {
    console.log('Listando usuarios...');
    const usuarios = await UsuarioModel.find({}, { password: 0 }); // No mostrar contraseñas
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar usuarios' });
  }
});

// POST - Crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    console.log('Creando nuevo usuario...');
    
    // Verificar si el email ya existe
    const existeUsuario = await UsuarioModel.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }
    
    const nuevoUsuario = await UsuarioModel.create({ 
      nombre, 
      email,
      password
    });
    
    // No devolver la contraseña en la respuesta
    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toObject();
    return res.status(201).json(usuarioSinPassword);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// POST - Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const usuario = await UsuarioModel.findOne({ email });
    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    // No devolver la contraseña en la respuesta
    const { password: _, ...usuarioSinPassword } = usuario.toObject();
    return res.status(200).json(usuarioSinPassword);
  } catch (error) {
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// ===== RECADOS =====

// GET - Listar recados de un usuario
app.get('/recados/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    console.log('Listando recados del usuario...');
    const recados = await RecadoModel.find({ usuarioId });
    return res.json(recados);
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar recados' });
  }
});

// POST - Crear un nuevo recado
app.post('/recados', async (req, res) => {
  try {
    const { usuarioId, titulo, descripcion, fecha, hora } = req.body;
    console.log('Creando nuevo recado...');
    const nuevoRecado = await RecadoModel.create({ 
      usuarioId, 
      titulo, 
      descripcion, 
      fecha: new Date(fecha),
      hora
    });
    return res.status(201).json(nuevoRecado);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear recado' });
  }
});

// PUT - Actualizar un recado
app.put('/recados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fecha, hora, completado } = req.body;
    
    console.log('Actualizando recado...');
    const recadoActualizado = await RecadoModel.findByIdAndUpdate(
      id, 
      { 
        titulo, 
        descripcion, 
        fecha: fecha ? new Date(fecha) : undefined,
        hora,
        completado
      },
      { new: true }
    );
    
    if (!recadoActualizado) {
      return res.status(404).json({ error: 'Recado no encontrado' });
    }
    
    return res.status(200).json(recadoActualizado);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar recado' });
  }
});

// DELETE - Eliminar un recado
app.delete('/recados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Eliminando recado...');
    await RecadoModel.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Recado eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar recado' });
  }
});

// ===== CITAS =====

// GET - Listar citas de un usuario
app.get('/citas/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    console.log('Listando citas del usuario...');
    const citas = await CitaModel.find({ usuarioId });
    return res.json(citas);
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar citas' });
  }
});

// POST - Crear una nueva cita
app.post('/citas', async (req, res) => {
  try {
    const { usuarioId, servicio, fecha, hora, descripcion, alarma, minutos_antes } = req.body;
    console.log('Creando nueva cita...');
    
    // Verificar si ya existe una cita para el mismo servicio en la misma fecha y hora
    const citaExistente = await CitaModel.findOne({
      servicio,
      fecha: new Date(fecha),
      hora
    });
    
    if (citaExistente) {
      return res.status(400).json({ 
        error: 'Ya existe una cita para este servicio en la fecha y hora seleccionadas' 
      });
    }
    
    const nuevaCita = await CitaModel.create({ 
      usuarioId, 
      servicio, 
      fecha: new Date(fecha),
      hora,
      descripcion,
      alarma: alarma ?? true,
      minutos_antes: minutos_antes ?? 30
    });
    return res.status(201).json(nuevaCita);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear cita' });
  }
});

// PUT - Actualizar una cita
app.put('/citas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { servicio, fecha, hora, descripcion, alarma, minutos_antes } = req.body;
    
    // Verificar si ya existe otra cita para el mismo servicio en la misma fecha y hora
    if (fecha && hora && servicio) {
      const citaExistente = await CitaModel.findOne({
        _id: { $ne: id }, // Excluir la cita actual
        servicio,
        fecha: new Date(fecha),
        hora
      });
      
      if (citaExistente) {
        return res.status(400).json({ 
          error: 'Ya existe una cita para este servicio en la fecha y hora seleccionadas' 
        });
      }
    }
    
    console.log('Actualizando cita...');
    const citaActualizada = await CitaModel.findByIdAndUpdate(
      id, 
      { 
        servicio, 
        fecha: fecha ? new Date(fecha) : undefined,
        hora,
        descripcion,
        alarma,
        minutos_antes
      },
      { new: true }
    );
    
    if (!citaActualizada) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    
    return res.status(200).json(citaActualizada);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar cita' });
  }
});

// DELETE - Eliminar una cita
app.delete('/citas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Eliminando cita...');
    await CitaModel.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar cita' });
  }
});

// GET - Verificar alarmas próximas
app.get('/alarmas/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    console.log('Verificando alarmas próximas...');
    
    // Obtener citas con alarma del usuario
    const citasConAlarma = await CitaModel.find({ 
      usuarioId,
      alarma: true 
    });
    
    const ahora = new Date();
    console.log('Hora actual del servidor:', ahora.toISOString());
    
    // Para depuración - mostrar todas las citas con alarma
    console.log(`Total de citas con alarma: ${citasConAlarma.length}`);
    citasConAlarma.forEach(cita => {
      console.log(`- Cita: ${cita.servicio}, Fecha: ${cita.fecha}, Hora: ${cita.hora}, Minutos antes: ${cita.minutos_antes}`);
    });
    
    const citasProximas = citasConAlarma.filter(cita => {
      const fechaCita = new Date(cita.fecha);
      const [horas, minutos] = cita.hora.split(':').map(num => parseInt(num));
      fechaCita.setHours(horas, minutos, 0, 0);
      
      // Restar los minutos de alarma
      const tiempoAlarma = new Date(fechaCita.getTime() - (cita.minutos_antes * 60 * 1000));
      
      // Para depuración - mostrar cálculos de tiempo
      console.log(`Cita: ${cita.servicio}, Hora cita: ${fechaCita.toISOString()}`);
      console.log(`Tiempo alarma: ${tiempoAlarma.toISOString()}`);
      
      // Calcular diferencia en minutos entre ahora y el tiempo de alarma
      const diferenciaMs = tiempoAlarma.getTime() - ahora.getTime();
      const diferenciaMinutos = diferenciaMs / (1000 * 60);
      console.log(`Diferencia: ${diferenciaMinutos.toFixed(2)} minutos`);
      
      // Ampliamos el margen para facilitar las pruebas (±5 minutos)
      // Esto hará que las alarmas sean más fáciles de detectar durante el desarrollo
      const rangoMinutos = 5;
      const enRangoAlarma = Math.abs(diferenciaMinutos) <= rangoMinutos;
      
      if (enRangoAlarma) {
        console.log(`¡ALERTA ACTIVA para cita ${cita.servicio}!`);
      }
      
      return enRangoAlarma;
    });
    
    // Registro adicional para depuración
    console.log(`Citas que requieren alarma: ${citasProximas.length}`);
    
    return res.json(citasProximas);
  } catch (error) {
    console.error('Error al verificar alarmas:', error);
    return res.status(500).json({ error: 'Error al verificar alarmas' });
  }
});

app.listen(3000, () => console.log('Servidor ejecutándose en http://localhost:3000'));