import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Esquema para Usuario con sus juegos
const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  juegos: [{
    titulo: String,
    etiquetas: [String] // Ejemplo: ["acción", "estrategia", "multijugador"]
  }]
});

const corsOptions = {
    origin: [
    'http://localhost:5173',  // si quieres permitir también vite corriendo local
    'http://localhost:8080'   // el contenedor que acabas de mapear
  ],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Modelo de base de datos para juegos estáticos (para recomendaciones)
const JuegoSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  imagen: String,
  etiquetas: [String]
});

const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);
const JuegoModel = mongoose.model('Juego', JuegoSchema);

const app = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Conexión a MongoDB
mongoose.connect('mongodb://root:password@base_datos:27017/test?authSource=admin');

// Inicializar algunos juegos si la colección está vacía
const inicializarJuegos = async () => {
  const count = await JuegoModel.countDocuments();
  if (count === 0) {
    console.log('Inicializando base de datos de juegos...');
    const juegosIniciales = [
      {
        titulo: "The Witcher 3: Wild Hunt",
        descripcion: "Un RPG de mundo abierto con una historia inmersiva y combate dinámico. Sigue las aventuras de Geralt de Rivia, un cazador de monstruos.",
        imagen: "https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/kh4MUIuMmHlktOHar3lVl6rY.png",
        etiquetas: ["RPG", "mundo abierto", "fantasía", "historia", "acción"]
      },
      {
        titulo: "Minecraft",
        descripcion: "Un juego de construcción y aventuras donde puedes crear prácticamente cualquier cosa en un mundo generado proceduralmente.",
        imagen: "https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/MC_SandstormAddOn2_NetHomepagePromo_Hero-A-0_Image-ID_1080x1080_01.jpg",
        etiquetas: ["sandbox", "construcción", "supervivencia", "multijugador"]
      },
      {
        titulo: "Counter-Strike 2",
        descripcion: "El shooter táctico por equipos más popular del mundo, con mecánicas de juego precisas y estrategia por equipos.",
        imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/capsule_616x353.jpg",
        etiquetas: ["FPS", "shooter", "acción", "multijugador", "competitivo"]
      },
      {
        titulo: "FIFA 24",
        descripcion: "El simulador de fútbol más realista con licencias oficiales, modos de juego variados y gráficos de última generación.",
        imagen: "https://m.media-amazon.com/images/I/81dhAH6jZ4L.__AC_SX300_SY300_QL70_ML2_.jpg",
        etiquetas: ["deportes", "simulación", "fútbol", "multijugador"]
      },
      {
        titulo: "League of Legends",
        descripcion: "Un MOBA competitivo con más de 150 campeones para elegir.",
        imagen: "https://cdn1.epicgames.com/offer/24b9b5e323bc40eea252a10cdd3b2f10/EGS_LeagueofLegends_RiotGames_S1_2560x1440-80471666c140f790f28dff68d72c384b",
        etiquetas: ["MOBA", "estrategia", "multijugador", "competitivo"]
      },
      {
        titulo: "Elden Ring",
        descripcion: "Un RPG de acción en un vasto mundo abierto con una narrativa creada por George R.R. Martin y Hidetaka Miyazaki.",
        imagen: "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phvVT0qZfcRms5qDAk0SI3CM.png",
        etiquetas: ["RPG", "mundo abierto", "acción", "difícil", "fantasía"]
      },
      {
        titulo: "Stardew Valley",
        descripcion: "Un juego de simulación de agricultura y vida rural con relaciones sociales.",
        imagen: "https://cdn.akamai.steamstatic.com/steam/apps/413150/capsule_616x353.jpg",
        etiquetas: ["simulación", "agricultura", "relajante", "pixel art"]
      },
      {
        titulo: "Baldur's Gate 3",
        descripcion: "Un RPG basado en Dungeons & Dragons que ofrece libertad de elección y consecuencias. Explora los Reinos Olvidados en esta épica aventura.",
        imagen: "https://i.blogs.es/0269aa/baldur-s-gate-3-pc-ps5-xbox/1024_682.webp",
        etiquetas: ["RPG", "por turnos", "fantasía", "historia", "D&D"]
      },
      {
        titulo: "Call of Duty: Modern Warfare",
        descripcion: "Un shooter bélico en primera persona con modo campaña y multijugador.",
        imagen: "https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7b75d8ed9271516546560d219ad0b22ee0a263b4537bd8.png",
        etiquetas: ["FPS", "shooter", "acción", "bélico", "multijugador"]
      },
      {
        titulo: "The Legend of Zelda: Breath of the Wild",
        descripcion: "Un juego de aventuras con un vasto mundo abierto para explorar.",
        imagen: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58",
        etiquetas: ["aventura", "mundo abierto", "acción", "puzzles"]
      }
    ];
    
    await JuegoModel.insertMany(juegosIniciales);
    console.log('Base de datos de juegos inicializada con éxito.');
  }
};

inicializarJuegos();

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

// POST - Crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, juegos } = req.body;
    console.log('Creando nuevo usuario...');
    const nuevoUsuario = await UsuarioModel.create({ 
      nombre, 
      juegos: juegos || []
    });
    return res.status(201).json(nuevoUsuario);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT - Actualizar un usuario
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, juegos } = req.body;
    console.log(`Actualizando usuario con ID: ${id}`);
    
    const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(
      id,
      { nombre, juegos },
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

// DELETE - Eliminar un usuario
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Eliminando usuario...');
    await UsuarioModel.findByIdAndDelete(id);
    return res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// POST - Añadir juego a un usuario
app.post('/usuarios/:id/juegos', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, etiquetas } = req.body;
    
    const usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Verificar si el juego ya existe en la lista del usuario
    const juegoExistente = usuario.juegos.find(j => j.titulo === titulo);
    if (juegoExistente) {
      return res.status(400).json({ error: 'El juego ya existe en la lista del usuario' });
    }
    
    usuario.juegos.push({
      titulo,
      etiquetas
    });
    
    await usuario.save();
    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ error: 'Error al añadir juego' });
  }
});

// DELETE - Eliminar juego de un usuario
app.delete('/usuarios/:userId/juegos/:juegoId', async (req, res) => {
  try {
    const { userId, juegoId } = req.params;
    
    const usuario = await UsuarioModel.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    usuario.juegos = usuario.juegos.filter(juego => juego._id.toString() !== juegoId);
    
    await usuario.save();
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar juego' });
  }
});

// GET - Obtener todos los juegos
app.get('/juegos', async (_req, res) => {
  try {
    console.log('Listando juegos...');
    const juegos = await JuegoModel.find();
    return res.json(juegos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar juegos' });
  }
});

// GET - Buscar juegos por etiquetas
app.get('/juegos/buscar', async (req, res) => {
  try {
    const { etiquetas } = req.query;
    
    if (!etiquetas) {
      return res.status(400).json({ error: 'Debes proporcionar al menos una etiqueta' });
    }
    
    // Convertir la cadena de etiquetas en un array
    const etiquetasArray = Array.isArray(etiquetas) 
      ? etiquetas 
      : etiquetas.split(',').map(tag => tag.trim());
    
    // Buscar juegos que coincidan con al menos una etiqueta
    const juegos = await JuegoModel.find({
      etiquetas: { $in: etiquetasArray }
    });
    
    return res.json(juegos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al buscar juegos' });
  }
});

// GET - Recomendaciones basadas en los juegos de un usuario
app.get('/recomendaciones/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Obtener el usuario y sus juegos
    const usuario = await UsuarioModel.findById(userId);
    if (!usuario || !usuario.juegos || usuario.juegos.length === 0) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado o sin juegos registrados' 
      });
    }
    
    // Extraer todas las etiquetas de los juegos del usuario
    const etiquetasUsuario = usuario.juegos.flatMap(juego => juego.etiquetas);
    
    // Contar la frecuencia de cada etiqueta
    const frecuenciaEtiquetas = {};
    etiquetasUsuario.forEach(etiqueta => {
      frecuenciaEtiquetas[etiqueta] = (frecuenciaEtiquetas[etiqueta] || 0) + 1;
    });
    
    // Ordenar etiquetas por frecuencia (más importantes primero)
    const etiquetasOrdenadas = Object.keys(frecuenciaEtiquetas).sort(
      (a, b) => frecuenciaEtiquetas[b] - frecuenciaEtiquetas[a]
    );
    
    // Tomar las 5 etiquetas más frecuentes (o todas si hay menos de 5)
    const etiquetasImportantes = etiquetasOrdenadas.slice(0, 5);
    
    // Obtener títulos de juegos que el usuario ya ha jugado
    const titulosJugados = usuario.juegos.map(juego => juego.titulo);
    
    // Buscar juegos con etiquetas similares que el usuario no haya jugado
    const recomendaciones = await JuegoModel.find({
      titulo: { $nin: titulosJugados },
      etiquetas: { $in: etiquetasImportantes }
    }).limit(5);
    
    return res.json(recomendaciones);
  } catch (error) {
    console.error('Error al generar recomendaciones:', error);
    return res.status(500).json({ error: 'Error al generar recomendaciones' });
  }
});

// GET - Recomendaciones basadas en etiquetas específicas
app.get('/recomendaciones', async (req, res) => {
  try {
    const { etiquetas } = req.query;
    
    if (!etiquetas) {
      // Si no se proporcionan etiquetas, devolver una selección aleatoria
      const juegosAleatorios = await JuegoModel.aggregate([
        { $sample: { size: 5 } }
      ]);
      return res.json(juegosAleatorios);
    }
    
    // Convertir la cadena de etiquetas en un array
    const etiquetasArray = Array.isArray(etiquetas) 
      ? etiquetas 
      : etiquetas.split(',').map(tag => tag.trim());
    
    // Buscar juegos que coincidan con al menos una etiqueta
    const recomendaciones = await JuegoModel.find({
      etiquetas: { $in: etiquetasArray }
    }).limit(5);
    
    return res.json(recomendaciones);
  } catch (error) {
    return res.status(500).json({ error: 'Error al generar recomendaciones' });
  }
});

app.listen(3000, () => console.log('Servidor ejecutándose en http://localhost:3000'));