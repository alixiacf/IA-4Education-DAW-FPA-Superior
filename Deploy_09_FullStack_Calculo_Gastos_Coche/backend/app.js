import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Esquema para Viaje
const ViajeSchema = new mongoose.Schema({
  destino: { 
    type: String, 
    required: true 
  },
  carModel: { 
    type: String, 
    required: true 
  },
  consumoMedio: { 
    type: Number, 
    required: true 
  },
  kilometros: { 
    type: Number, 
    required: true 
  },
  precioCombustible: { 
    type: Number, 
    required: true 
  },
  precioTotal: { 
    type: Number, 
    default: function() {
      return (this.kilometros / 100) * this.consumoMedio * this.precioCombustible;
    }
  },
  viajerosNecesarios: { 
    type: Number, 
    required: true,
    min: 1
  },
  viajerosConfirmados: { 
    type: Number, 
    default: 0 
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  tipoCombustible: {
    type: String,
    enum: ['Gasolina', 'Diesel', 'Eléctrico', 'Híbrido'],
    default: 'Gasolina'
  },
  conductor: {
    type: String,
    required: true
  },
  notas: {
    type: String,
    default: ''
  }
});

// Añadir método virtual para calcular el precio por viajero
ViajeSchema.virtual('precioPorViajero').get(function() {
  const viajeros = this.viajerosConfirmados || 1;
  return this.precioTotal / viajeros;
});

// Configurar para que las virtuals se incluyan cuando convertimos a JSON
ViajeSchema.set('toJSON', { virtuals: true });
ViajeSchema.set('toObject', { virtuals: true });

const corsOptions = {
  origin: [
    'http://localhost:5173',  // si quieres permitir también vite corriendo local
    'http://localhost:8080'   // el contenedor que acabas de mapear
  ],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Modelo de Coches Populares para autocompletado y referencias
const CocheSchema = new mongoose.Schema({
  modelo: {
    type: String,
    required: true
  },
  marca: {
    type: String,
    required: true
  },
  consumoMedio: {
    type: Number,
    required: true
  },
  tipoCombustible: {
    type: String,
    enum: ['Gasolina', 'Diesel', 'Eléctrico', 'Híbrido'],
    default: 'Gasolina'
  },
  capacidadPasajeros: {
    type: Number,
    default: 5
  }
});

const ViajeModel = mongoose.model('Viaje', ViajeSchema);
const CocheModel = mongoose.model('Coche', CocheSchema);

const app = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Conexión a MongoDB con log para debugging
mongoose.connect('mongodb://root:password@base_datos:27017/test?authSource=admin')
  .then(() => console.log('✅ Conexión exitosa a MongoDB'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Inicializar algunos coches populares si la colección está vacía
const inicializarCoches = async () => {
  try {
    const count = await CocheModel.countDocuments();
    console.log(`Encontrados ${count} coches en la base de datos`);
    
    if (count === 0) {
      console.log('Inicializando base de datos de coches...');
      const cochesIniciales = [
        {
          modelo: "Corolla",
          marca: "Toyota",
          consumoMedio: 5.5,
          tipoCombustible: "Gasolina",
          capacidadPasajeros: 5
        },
        {
          modelo: "Golf",
          marca: "Volkswagen",
          consumoMedio: 5.8,
          tipoCombustible: "Gasolina",
          capacidadPasajeros: 5
        },
        {
          modelo: "Civic",
          marca: "Honda",
          consumoMedio: 6.0,
          tipoCombustible: "Gasolina",
          capacidadPasajeros: 5
        },
        {
          modelo: "C4",
          marca: "Citroën",
          consumoMedio: 5.9,
          tipoCombustible: "Diesel",
          capacidadPasajeros: 5
        },
        {
          modelo: "Focus",
          marca: "Ford",
          consumoMedio: 5.7,
          tipoCombustible: "Diesel",
          capacidadPasajeros: 5
        },
        {
          modelo: "308",
          marca: "Peugeot",
          consumoMedio: 5.6,
          tipoCombustible: "Diesel",
          capacidadPasajeros: 5
        },
        {
          modelo: "Clio",
          marca: "Renault",
          consumoMedio: 5.3,
          tipoCombustible: "Gasolina",
          capacidadPasajeros: 5
        },
        {
          modelo: "Model 3",
          marca: "Tesla",
          consumoMedio: 0,
          tipoCombustible: "Eléctrico",
          capacidadPasajeros: 5
        },
        {
          modelo: "Prius",
          marca: "Toyota",
          consumoMedio: 4.2,
          tipoCombustible: "Híbrido",
          capacidadPasajeros: 5
        },
        {
          modelo: "Kona Electric",
          marca: "Hyundai",
          consumoMedio: 0,
          tipoCombustible: "Eléctrico",
          capacidadPasajeros: 5
        }
      ];
      
      await CocheModel.insertMany(cochesIniciales);
      console.log('✅ Base de datos de coches inicializada con éxito.');
    }
  } catch (error) {
    console.error('❌ Error al inicializar coches:', error);
  }
};

// Inicializamos los coches después de conectar a MongoDB
mongoose.connection.once('open', () => {
  console.log('🚀 Conexión a MongoDB establecida, inicializando datos...');
  inicializarCoches();
});

// Rutas
app.get('/', (_req, res) => {
  res.json({ message: 'API de gestión de viajes funcionando correctamente' });
});

// GET - Listar todos los viajes
app.get('/viajes', async (_req, res) => {
  try {
    console.log('Listando viajes...');
    const viajes = await ViajeModel.find().sort({ fecha: -1 });
    return res.json(viajes);
  } catch (error) {
    console.error('Error al listar viajes:', error);
    return res.status(500).json({ error: 'Error al listar viajes' });
  }
});

// GET - Obtener un viaje por ID
app.get('/viajes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Buscando viaje con ID: ${id}`);
    const viaje = await ViajeModel.findById(id);
    if (!viaje) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    return res.json(viaje);
  } catch (error) {
    console.error(`Error al buscar viaje ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Error al buscar viaje' });
  }
});

// POST - Crear un nuevo viaje
app.post('/viajes', async (req, res) => {
  try {
    const { destino, carModel, consumoMedio, kilometros, precioCombustible, viajerosNecesarios, tipoCombustible, conductor, notas } = req.body;
    console.log('Creando nuevo viaje...', req.body);
    
    // Validaciones adicionales
    if (kilometros <= 0) {
      return res.status(400).json({ error: 'Los kilómetros deben ser un valor positivo' });
    }
    
    if (consumoMedio < 0) {
      return res.status(400).json({ error: 'El consumo medio debe ser un valor no negativo' });
    }
    
    if (precioCombustible <= 0) {
      return res.status(400).json({ error: 'El precio del combustible debe ser un valor positivo' });
    }
    
    if (viajerosNecesarios < 1) {
      return res.status(400).json({ error: 'Se necesita al menos un viajero' });
    }
    
    const nuevoViaje = await ViajeModel.create({ 
      destino, 
      carModel, 
      consumoMedio, 
      kilometros, 
      precioCombustible, 
      viajerosNecesarios,
      tipoCombustible: tipoCombustible || 'Gasolina',
      conductor,
      notas: notas || ''
    });
    
    console.log('✅ Viaje creado con ID:', nuevoViaje._id);
    // Incluyendo redirección en la respuesta para solucionar el problema de navegación
    return res.status(201).json({
      viaje: nuevoViaje,
      redirect: '/', // Indica al frontend que debe redirigir a la página principal
      mensaje: 'Viaje creado correctamente'
    });
  } catch (error) {
    console.error('Error al crear viaje:', error);
    return res.status(500).json({ error: 'Error al crear viaje' });
  }
});

// PUT - Unirse a un viaje (incrementar viajerosConfirmados)
app.put('/viajes/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Añadiendo viajero al viaje con ID: ${id}`);
    
    const viaje = await ViajeModel.findById(id);
    if (!viaje) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    
    // Verificar si hay plazas disponibles
    if (viaje.viajerosConfirmados >= viaje.viajerosNecesarios) {
      return res.status(400).json({ error: 'No hay plazas disponibles para este viaje' });
    }
    
    // Incrementar el contador de viajeros confirmados
    viaje.viajerosConfirmados += 1;
    await viaje.save();
    
    return res.json({
      viaje,
      mensaje: `Te has unido al viaje a ${viaje.destino}`,
      precioPorViajero: viaje.precioPorViajero,
      redirect: '/' // Indica al frontend que debe redirigir a la página principal
    });
  } catch (error) {
    console.error(`Error al unirse al viaje ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Error al unirse al viaje' });
  }
});

// DELETE - Eliminar un viaje
app.delete('/viajes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Eliminando viaje...');
    const viaje = await ViajeModel.findByIdAndDelete(id);
    
    if (!viaje) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    
    return res.status(200).json({ 
      mensaje: 'Viaje eliminado correctamente',
      redirect: '/' // Indica al frontend que debe redirigir a la página principal
    });
  } catch (error) {
    console.error(`Error al eliminar viaje ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Error al eliminar viaje' });
  }
});

// GET - Obtener lista de coches para autocompletado
app.get('/coches', async (_req, res) => {
  try {
    console.log('Listando coches disponibles...');
    const coches = await CocheModel.find().sort({ marca: 1, modelo: 1 });
    return res.json(coches);
  } catch (error) {
    console.error('Error al listar coches:', error);
    return res.status(500).json({ error: 'Error al listar coches' });
  }
});

// GET - Buscar coches por marca o modelo (importante: esta ruta debe ir ANTES de /coches/:id)
app.get('/coches/buscar', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Debes proporcionar un término de búsqueda' });
    }
    
    console.log(`Buscando coches con término: ${query}`);
    
    // Buscar coches que coincidan por marca o modelo
    const coches = await CocheModel.find({
      $or: [
        { marca: { $regex: query, $options: 'i' } },
        { modelo: { $regex: query, $options: 'i' } }
      ]
    }).sort({ marca: 1, modelo: 1 });
    
    console.log(`Encontrados ${coches.length} coches para término "${query}"`);
    return res.json(coches);
  } catch (error) {
    console.error('Error en búsqueda de coches:', error);
    return res.status(500).json({ error: 'Error al buscar coches' });
  }
});

// GET - Obtener los datos de un coche específico por ID
app.get('/coches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Si el id es "buscar", significa que Express está confundiendo la ruta
    if (id === 'buscar' || id === 'detalle') {
      return res.status(400).json({ error: 'Ruta incorrecta. Use /coches/buscar?query=texto o /coches/detalle?marca=X&modelo=Y' });
    }
    
    console.log(`Buscando coche con ID: ${id}`);
    const coche = await CocheModel.findById(id);
    if (!coche) {
      return res.status(404).json({ error: 'Coche no encontrado' });
    }
    
    // Añadir información de viajeros recomendados (capacidad - 1 para el conductor)
    const viajerosRecomendados = Math.max(1, coche.capacidadPasajeros - 1);
    
    return res.json({
      ...coche.toObject(),
      viajerosRecomendados
    });
  } catch (error) {
    console.error(`Error al buscar coche ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Error al buscar coche' });
  }
});

// Endpoint para obtener detalles de un coche por marca y modelo
app.get('/coches/detalle', async (req, res) => {
  try {
    const { marca, modelo } = req.query;
    
    if (!marca || !modelo) {
      return res.status(400).json({ error: 'Debes proporcionar marca y modelo' });
    }
    
    console.log(`Buscando coche ${marca} ${modelo}`);
    
    // Buscar el coche específico
    const coche = await CocheModel.findOne({
      marca: { $regex: marca, $options: 'i' },
      modelo: { $regex: modelo, $options: 'i' }
    });
    
    if (!coche) {
      return res.status(404).json({ error: 'Coche no encontrado' });
    }
    
    // Añadir información de viajeros recomendados (capacidad - 1 para el conductor)
    const viajerosRecomendados = Math.max(1, coche.capacidadPasajeros - 1);
    
    return res.json({
      ...coche.toObject(),
      viajerosRecomendados
    });
  } catch (error) {
    console.error(`Error al buscar detalles del coche:`, error);
    return res.status(500).json({ error: 'Error al buscar detalles del coche' });
  }
});

// GET - Endpoint de calculadora
app.get('/calcular', (req, res) => {
  try {
    const { kilometros, consumo, precio, viajeros } = req.query;
    
    // Convertir los parámetros a números
    const kmNum = Number(kilometros);
    const consumoNum = Number(consumo);
    const precioNum = Number(precio);
    const viajerosNum = Number(viajeros) || 1;
    
    // Validaciones
    if (isNaN(kmNum) || isNaN(consumoNum) || isNaN(precioNum)) {
      return res.status(400).json({ error: 'Los parámetros deben ser números válidos' });
    }
    
    if (kmNum <= 0) {
      return res.status(400).json({ error: 'Los kilómetros deben ser un valor positivo' });
    }
    
    if (consumoNum < 0) {
      return res.status(400).json({ error: 'El consumo medio debe ser un valor no negativo' });
    }
    
    if (precioNum <= 0) {
      return res.status(400).json({ error: 'El precio del combustible debe ser un valor positivo' });
    }
    
    if (viajerosNum < 1) {
      return res.status(400).json({ error: 'Se necesita al menos un viajero' });
    }
    
    // Calcular el precio total y por viajero
    const precioTotal = (kmNum / 100) * consumoNum * precioNum;
    const precioPorViajero = precioTotal / viajerosNum;
    
    console.log(`Cálculo realizado: ${kmNum}km, ${consumoNum}L/100km, ${precioNum}€/L, ${viajerosNum} viajeros`);
    console.log(`Resultado: Total ${precioTotal}€, Por viajero ${precioPorViajero}€`);
    
    return res.json({
      kilometros: kmNum,
      consumoMedio: consumoNum,
      precioCombustible: precioNum,
      viajeros: viajerosNum,
      precioTotal: precioTotal,
      precioPorViajero: precioPorViajero
    });
  } catch (error) {
    console.error('Error en el cálculo:', error);
    return res.status(500).json({ error: 'Error al realizar el cálculo' });
  }
});

// Ruta por defecto para rutas no encontradas
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`));