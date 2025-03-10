import express from 'express';
import { Tarea } from '../models/tarea.js';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new task
router.post('/', async (req, res) => {
  const tarea = new Tarea({
    nombre: req.body.nombre,
    horasEstimadas: req.body.horasEstimadas,
    horasReales: 0
  });

  try {
    const nuevaTarea = await tarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (req.body.horasReales !== undefined) {
      tarea.horasReales = req.body.horasReales;
    }

    const tareaActualizada = await tarea.save();
    res.json(tareaActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    await tarea.deleteOne();
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const tareaRoutes = router;