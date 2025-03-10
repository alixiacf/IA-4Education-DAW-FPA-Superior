import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/tareas_db";

// **Conexión a MongoDB**
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error conectando a MongoDB:", err));

// **Modelo de Tareas**
const TareaSchema = new mongoose.Schema({
  nombre: String,
  horasEstimadas: Number,
  horasReales: { type: Number, default: 0 }
});

const Tarea = mongoose.model("Tarea", TareaSchema);

// **Endpoints**

app.get("/tareas", async (_req, res) => {
  const tareas = await Tarea.find();
  res.json(tareas);
});

app.post("/tareas", async (req, res) => {
  const { nombre, horasEstimadas } = req.body;
  const nuevaTarea = new Tarea({ nombre, horasEstimadas });
  await nuevaTarea.save();
  res.status(201).json(nuevaTarea);
});

app.put("/tareas/:id", async (req, res) => {
  const { id } = req.params;
  const { horasReales } = req.body;
  const tarea = await Tarea.findByIdAndUpdate(id, { horasReales }, { new: true });
  res.json(tarea);
});

app.delete("/tareas/:id", async (req, res) => {
  await Tarea.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Tarea eliminada" });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
